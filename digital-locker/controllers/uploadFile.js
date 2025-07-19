const File = require('../models/File');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, msg: "No file uploaded" });
    }

    console.log(req.file.name);
    const newFile = new File({
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      data: req.file.buffer,
      user: req.user.id
    });

    await newFile.save();

    res.status(200).json({ success: true, msg: "File uploaded successfully" });

  } catch (error) {
    console.error("File Upload Error:", error);
    res.status(500).json({ success: false, msg: "Error storing the file" });
  }
};

exports.openFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).send('File not found');

    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': 'inline; filename="' + file.filename + '"',
    });

    res.send(file.data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


exports.deleteFile = async (req,res)=> {
  try {
    const file = await File.findByIdAndDelete(req.params.id);
    if (!file) return res.status(404).send('File not found');
    res.status(200).json({ success: true, msg: "File deleted successfully" });
  }catch (error) {
    console.error("File Delete Error:", error);
    res.status(500).json({ success: false, msg: "Error deleting the file"});
  }
}

exports.renameFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const newName = req.body.name; 

    if (!newName || newName.trim() === '') {
      return res.status(400).json({ success: false, msg: "New name is required" });
    }
    
    const isExist = await File.findOne({ name: newName });
    if (isExist) {
      return res.status(400).json({ success: false, msg: "A file with this name already exists" });
    }

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ success: false, msg: "File not found" });
    }

    file.filename = newName;
    await file.save();

    res.status(200).json({ success: true, msg: "File renamed successfully" });
  } catch (error) {
    console.error("Rename File Error:", error);
    res.status(500).json({ success: false, msg: "Error renaming the file" });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).send('File not found');

    res.download(file.path, file.name); // Replace with correct file location
  } catch (err) {
    console.error("Download error:", err.message);
    res.status(500).send("Server error");
  }
};
