import { IoSearch } from "react-icons/io5";
import { IoMdDocument } from "react-icons/io";
import { CiImageOn, CiMenuKebab } from "react-icons/ci";
import { useEffect, useState } from "react";
import { FaFileImage, FaFilePdf, FaShareSquare } from "react-icons/fa";
import {
  MdDelete,
  MdDriveFileRenameOutline,
  MdFileDownload,
} from "react-icons/md";

const Uplode = () => {
  const [active, setActive] = useState({ pdf: false, img: false });
  const [files, setFiles] = useState([]);
  const [originalFiles, setOriginalFiles] = useState([]);
  const [menuId, setMenuId] = useState(null);
  const [rename, setRename] = useState(false);
  const [rvalue, setRvalue] = useState("");
  const [renameId, setRenameId] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  // 📥 Initial fetch
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/files", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setOriginalFiles(data);
      setFiles(data);
    } catch (error) {
      console.error("Failed to fetch files", error);
    }
  };

  // 🔎 Filter by MIME + Search
  useEffect(() => {
    let filtered = originalFiles;

    if (active.pdf || active.img) {
      filtered = filtered.filter((file) => {
        if (active.pdf && file.mimetype.includes("pdf")) return true;
        if (active.img && file.mimetype.includes("image")) return true;
        return false;
      });
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((file) =>
        file.filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFiles(filtered);
  }, [active, originalFiles, searchTerm]);

  // 🧠 Filter option toggle
  const FilterOption = (type) => {
    setActive((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // 📂 Delete file
  const deleteFile = async (id) => {
    await fetch(`http://localhost:3000/api/deleteFile/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchFiles(); // refresh list
  };

  // 📝 Rename
  const renameFile = (id) => {
    setRename(true);
    setMenuId(null);
    setRenameId(id);
  };

  const updateFile = async () => {
    await fetch(`http://localhost:3000/api/renameFile/${renameId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: rvalue }),
    });
    setRename(false);
    setRvalue("");
    fetchFiles();
  };

  // ⬇️ Download
const downloadFile = async (fileId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/files/${fileId}/download`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // if your backend requires it
      },
    });

    if (!response.ok) {
      throw new Error("Failed to download");
    }

    const blob = await response.blob();

    // Try to get the filename from headers
    const contentDisposition = response.headers.get("Content-Disposition");
    const match = contentDisposition?.match(/filename="?(.+)"?/);
    const fileName = match ? match[1] : "downloaded_file";

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};


  // 🔗 Share
  const shareFile = async (fileId) => {
    try {
      const shareUrl = `${window.location.origin}/shared/${fileId}`;
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy share link:", err);
    }
  };

  return (
    <div className="upload-Container">
      <div className="upload-header">
        <h1>All the Documents</h1>
        <div className="searchBar">
          <IoSearch className="icon" />
          <input
            type="text"
            placeholder="Enter the Filename"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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

      <div className="files uploadfiles">
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
                  <CiMenuKebab onClick={() => setMenuId((prev) => prev === file._id ? null : file._id)} />
                  <div className={`menu ${menuId === file._id ? "openMenu" : ""}`}>
                    <ul>
                      <li onClick={() => downloadFile(file._id)}>
                        <MdFileDownload className="icon" />
                        Download
                      </li>
                      <li onClick={() => shareFile(file._id)}>
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
          <input type="text" value={rvalue} onChange={(e) => setRvalue(e.target.value)} />
        </div>
        <div className="buttons">
          <div className="cancel" onClick={() => setRename(false)}>
            Cancel
          </div>
          <div className="save" onClick={updateFile}>
            Save
          </div>
        </div>
      </div>
    </div>
  );
};

export default Uplode;
