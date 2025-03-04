const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {User} = require('../model');

const registerUser = async (req, res) => {
    console.log('Request body:', req.body);  // Log the request body

    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        console.log('User saved:', newUser);  // Log the user details after saving

        const token = jwt.sign({ userId: newUser._id, username: newUser.username }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Error during registration:', error);  // Log any error that occurs
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};


const loginUser = async( req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if(!user){
        return res.status(400).json({message: 'Invalid credentials.'});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({message: 'Invalid credentials.'});
    }

    const token = jwt.sign({userId: user._id, username: user.username}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});
    res.json({message: 'Login successfull', token});
};

const deleteUserAccount = async (req, res) => {
    try{
        const userId = req.userId;
        const user = await User.findByIdAndDelete(userId);
        if(!user){
            return res.status(404).json({message: 'User not found.'});
        }
        res.json({message: 'Account and all associated data deleted successfully.'});
    } catch (err){
        res.sta(500).json({message: 'Error deleting account.', error: err});
    }
};

module.exports = { registerUser, loginUser, deleteUserAccount};