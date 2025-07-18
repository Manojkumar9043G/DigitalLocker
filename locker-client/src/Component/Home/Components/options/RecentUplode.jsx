import { useEffect, useState } from "react";
import { FaFileImage, FaFilePdf } from "react-icons/fa";

export const RecentUpload = () => {
  const token = localStorage.getItem('token');
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/files', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        setFiles(data);
      } catch (err) {
        console.error("Failed to fetch files", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="recentUploads">
      <h2>Recent Uploads</h2>
      <div className="recent-upload-container">
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
            </div>
          ))
        )}
      </div>
    </div>
  );
};
