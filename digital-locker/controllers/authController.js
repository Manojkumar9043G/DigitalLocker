const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;


exports.register = async (req, res) => {
    try {
        console.log('hi');
        const { name, email, password } = req.body;

        console.log("Registering:", name, email); 

        if (!name || !email || !password) {
            return res.status(400).json({ success:false, msg: 'Please enter all fields' });
        }

        const isExest = await User.findOne({ email });
        console.log("Is existing user:", isExest); 

        if (isExest) {
            return res.status(400).json({ success:false, msg: 'This email is already registered' });
        }

        const Hashing = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: Hashing
        });

        await user.save();

        res.status(200).json({ success:true, msg: 'User created' });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(400).send('Error in registration');
    }
};


exports.login = async (req,res) =>{
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({ success:false, msg: 'Please enter all fields'});
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({ success:false,msg: 'Email does not exist'});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({ success:false,msg: 'Invalid password'});
        }

        const token = jwt.sign(
            {id : user._id,email : user.email},
            JWT_SECRET,
            {expiresIn : '2h'}
        );

        res.status(200).json(
            {
                success:true, 
                msg:'User logged in successfully',
                token:token,
                userId : user._id
        });

    }  catch (error) {
        console.error(error);
        res.status(500).send('Server error during login');
    }
};
