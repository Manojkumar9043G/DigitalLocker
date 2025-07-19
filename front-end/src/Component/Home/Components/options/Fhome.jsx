import { useState } from "react";
import { RecentUpload } from "./RecentUplode";
import { RiContactsBookUploadFill } from "react-icons/ri";

const Fhome = () => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleChanges = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setMessage(`Selected: ${selected.name}`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    setMessage(`Dropped: ${droppedFile.name}`);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    const form = new FormData();
    form.append('file', file);
    const  token = localStorage.getItem('token');

    try {
      const response = await fetch('https://digitallocker.onrender.com/api/upload', {
        method: 'POST',
        headers : {
          'Authorization': `Bearer ${token}`
        },
        body: form,
      });

      const data = await response.json();
      setMessage(data.msg);
    } catch (error) {
      console.error("Upload error:");
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="FHome">
      <div
      className={`uploadContainer ${dragActive ? "drag-active" : ""}`}
      onClick={(e) => {
        const tag = e.target.tagName.toLowerCase();
        if (!['button', 'input', 'label'].includes(tag)) {
          document.getElementById("hiddenInput").click();
        }
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      >
      <form onSubmit={handleSubmit} method="post">
          <div className="uploadIcon">
            <RiContactsBookUploadFill className="icon" />
              <p>Click or drag file to upload</p>
            </div>

            <input
              type="file"
              id="hiddenInput"
              name="file"
              onChange={handleChanges}
              style={{ display: "none" }}
            />

            <div className={`message ${message ? "fade-in" : ""}`}>{message}</div>

            <button type="submit">Submit</button>
        </form>
      </div>
      <RecentUpload />
    </div>
  );
};

export default Fhome;
