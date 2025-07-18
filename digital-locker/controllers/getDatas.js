const file = require('../models/File');

exports.getDatas = async (req, res) => {
    try {
        const files = await file.find({ user: req.user.id });  // ✅ Fix here
        res.status(200).json(files);  // ✅ Respond with data
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });  // ✅ Better error handling
    }
};
