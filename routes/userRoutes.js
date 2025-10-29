const express = require('express');
const User = require('../models/users');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    res.send('User routes are working!');
});

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user=new User({name,email,password});
        await user.save();
        res.status(201).send({user,message:"User registered successfully"});
    }
    
    catch (error) {
        res.status(400).send({error,message:"Error registering user"});
    }

});
router.post('/login', async (req, res) => {
    try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign({
         _id: user._id.toString()
    }, process.env.JWT_SECRET_KEY);
     
    res.send({user,token,message:"User logged in successfully"});
     }
    catch (error) {
        res.status(400).send({error,message:"Error logging in"});
    }
});


module.exports = router;