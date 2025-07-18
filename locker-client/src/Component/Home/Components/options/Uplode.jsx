import { IoSearch } from "react-icons/io5";
import { IoMdDocument } from "react-icons/io";
import { CiImageOn } from "react-icons/ci";
import { CiMenuKebab } from "react-icons/ci";
import { use, useEffect, useState } from "react";
import { FaFileImage, FaFilePdf } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaShareSquare } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { MdFileDownload } from "react-icons/md";


const Uplode =()=>{
    const [active,setActive] = useState({
        pdf : false,
        img : false
    });

    const [files,setFile] = useState([]);
    const [menuId,setMenuId] = useState(null);
    const token = localStorage.getItem('token');
    const [rename,setRename] = useState(false);
    const [rvalue,setRvalue] = useState('');
    const [renameId,setRenameid] = useState();

    useEffect(()=>{
        const fetchData = async () =>{
            try {
                const response = await fetch('http://localhost:3000/api/files',{
                    method : 'GET',
                    headers : {
                        'Authorization' : `Bearer ${token}`,
                        'Content-Type' : 'application/json',
                    }
                })
                const data = await response.json();
                setFile(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    },[],active);

    const FilterOption =(type)=>{
        setActive({
            ...active,
            [type] : !active[type]
        })
    };

    const menuOpen =(id)=>{
        if(menuId === id){
            setMenuId(false)
        }else{
            setMenuId(id);
        }
    };

    const deleteFile = async (id)=>{
        const response = await fetch(`http://localhost:3000/api/deleteFile/${id}`,{
            method : 'DELETE',
            headers : {
                'Authorization' : `Bearer ${token}`,
            }
        })
        const data = await response.json();
    }

    const renameValue =(e)=>{
        const name = e.target.value;
        setRvalue((prev) =>({
            ...prev,
            name
        }))
    }

    const renameFile = async (id) =>{
        setRename(true);
        setMenuId(false);
        setRenameid(id);
    }

    const updateFile = async () => {
        alert(renameId);
        const response = await fetch(`http://localhost:3000/api/renameFile/${renameId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(rvalue) // Convert JS object to JSON string
        });

        const data = await response.json();
        console.log(data.msg);
    };

    const filterPdf = ()=>{
        if(active.pdf){
            setFile((prevFile)=>
                prevFile.filter((file)=> file.mimetype.includes("pdf"))
            );
        }
    }

    return<>
        <div className="upload-Container">
            <div className="upload-header">
                <h1>All the Document</h1>
                <div className="searchBar">
                    <IoSearch className="icon"/>
                    <input type="text" placeholder="Enter the Filename"/>
                </div>
            </div>
            <div className="mimeType">
                <div className={`upload-pdf ${active.pdf ? `active` : ``}`} 
                     onClick={()=> FilterOption('pdf')}
                >
                    <IoMdDocument className="icon"/>PDF
                </div>
                <div className={`upload-img ${active.img ? `active` : ``}`}
                     onClick={()=> FilterOption('img')}>
                    <CiImageOn className="icon"/>IMG
                </div>
            </div>
            <div className="files">
                <div className="recent-upload-container upload-files">
                        {files.length === 0 ? (
                          <p>No uploads found.</p>
                        ) : (
                          files.map((file, index) => (
                            <div className="item" key={index}>
                              <div className="filename">
                                <a
                                  href={`http://localhost:3000/api/files/${file._id}/view`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <div className="icon">
                                    {file.mimetype.includes("pdf") ? <FaFilePdf /> : <FaFileImage />}
                                  </div>
                                  {file.filename}
                                </a>
                              </div>
                              <div className="size">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                              </div>
                              <div className="date">
                                {new Date(file.uploadedAt).toLocaleDateString()}
                              </div>
                              <div className="menu-icon">
                                <CiMenuKebab onClick={()=>{menuOpen(file._id)}}/>
                                <div className={`menu ${menuId === file._id ? `openMenu` : ``}`}>
                                    <ul>
                                        <li><MdFileDownload className="icon" onClick={()=>downloadFile(file._id)}/>Download</li>
                                        <li><FaShareSquare className="icon"/>Share</li>
                                        <li onClick={()=>renameFile(file._id)}><MdDriveFileRenameOutline className="icon"/>Rename</li>
                                        <li onClick={()=>deleteFile(file._id)}><MdDelete className="icon" />Delete</li>
                                    </ul>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                    </div>
            </div>

            <div className={`renameInputs ${rename ? `renameActive` : ``}`}>
                <h2>Rename</h2>
                <div className="renameInput">
                    <input type="text" name="rename" id="" onChange={renameValue}/>
                </div>
                <div className="buttons">
                    <div className="cencel" onClick={()=>{
                        setRename(false);
                    }}>Cencel</div>
                    <div className="save" onClick={updateFile}>Save</div>
                </div>
            </div>
        </div>
    </>
}

export default Uplode;