import { IoSearch } from "react-icons/io5";
import { IoMdDocument } from "react-icons/io";
import { CiImageOn, CiMenuKebab } from "react-icons/ci";
import { useEffect, useState } from "react";
import { FaFileImage, FaFilePdf, FaShareSquare } from "react-icons/fa";
import { MdDelete, MdDriveFileRenameOutline, MdFileDownload } from "react-icons/md";

const Uplode = () => {
  const [active, setActive] = useState({ pdf: false, img: false });
  const [files, setFile] = useState([]);
  const [originalFiles, setOriginalFiles] = useState([]); // 🔴 Keeps all data
  const [menuId, setMenuId] = useState(null);
  const token = localStorage.getItem("token");
  const [rename, setRename] = useState(false);
  const [rvalue, setRvalue] = useState(""); // now a string
  const [renameId, setRenameid] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/files", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setOriginalFiles(data); // store full list
        setFile(data); // current view
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // 🔄 Filter files whenever active state changes
  useEffect(() => {
    let filtered = originalFiles;

    if (active.pdf || active.img) {
      filtered = originalFiles.filter((file) => {
        if (active.pdf && file.mimetype.includes("pdf")) return true;
        if (active.img && file.mimetype.includes("image")) return true;
        return false;
      });
    }

    setFile(filtered);
  }, [active, originalFiles]);

  const FilterOption = (type) => {
    setActive((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const menuOpen = (id) => {
    setMenuId((prev) => (prev === id ? null : id));
  };

  const deleteFile = async (id) => {
    await fetch(`http://localhost:3000/api/deleteFile/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Refetch updated list after delete
    const res = await fetch("http://localhost:3000/api/files", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setOriginalFiles(data);
    setFile(data);
  };

  const renameValue = (e) => {
    setRvalue(e.target.value);
  };

  const renameFile = (id) => {
    setRename(true);
    setMenuId(null);
    setRenameid(id);
  };

  const updateFile = async () => {
    const response = await fetch(
      `http://localhost:3000/api/renameFile/${renameId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: rvalue }),
      }
    );

    const data = await response.json();
    console.log(data.msg);

    // Refresh file list
    const res = await fetch("http://localhost:3000/api/files", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const updated = await res.json();
    setOriginalFiles(updated);
    setFile(updated);
    setRename(false);
    setRvalue("");
  };

  const downloadFile = (id) => {
    window.open(`http://localhost:3000/api/files/${id}/download`, "_blank");
  };

  return (
    <>
      <div className="upload-Container">
        <div className="upload-header">
          <h1>All the Document</h1>
          <div className="searchBar">
            <IoSearch className="icon" />
            <input type="text" placeholder="Enter the Filename" />
          </div>
        </div>

        <div className="mimeType">
          <div
            className={`upload-pdf ${active.pdf ? "active" : ""}`}
            onClick={() => FilterOption("pdf")}
          >
            <IoMdDocument className="icon" /> PDF
          </div>
          <div
            className={`upload-img ${active.img ? "active" : ""}`}
            onClick={() => FilterOption("img")}
          >
            <CiImageOn className="icon" /> IMG
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
                        {file.mimetype.includes("pdf") ? (
                          <FaFilePdf />
                        ) : (
                          <FaFileImage />
                        )}
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
                    <CiMenuKebab onClick={() => menuOpen(file._id)} />
                    <div
                      className={`menu ${menuId === file._id ? "openMenu" : ""}`}
                    >
                      <ul>
                        <li>
                          <MdFileDownload
                            className="icon"
                            onClick={() => downloadFile(file._id)}
                          />
                          Download
                        </li>
                        <li>
                          <FaShareSquare className="icon" />
                          Share
                        </li>
                        <li onClick={() => renameFile(file._id)}>
                          <MdDriveFileRenameOutline className="icon" />
                          Rename
                        </li>
                        <li onClick={() => deleteFile(file._id)}>
                          <MdDelete className="icon" />
                          Delete
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={`renameInputs ${rename ? "renameActive" : ""}`}>
          <h2>Rename</h2>
          <div className="renameInput">
            <input type="text" value={rvalue} onChange={renameValue} />
          </div>
          <div className="buttons">
            <div
              className="cencel"
              onClick={() => {
                setRename(false);
              }}
            >
              Cancel
            </div>
            <div className="save" onClick={updateFile}>
              Save
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Uplode;
