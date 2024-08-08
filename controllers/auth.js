const { StatusCodes } = require('http-status-codes');
const BadRequestError = require('../errors/bad-request');
const unAuthenticatedError = require('../errors/unAuthenticated');
const User = require('../models/user')

const signIn = async(req, res)=>{
    const { email, password } = req.body;
    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({email});
    if(!user){
        throw new unAuthenticatedError('Invalid credentials')
    }
    // check password
    const isPasswordMatch = await user.comparePassword(password);
    if(!isPasswordMatch){
        throw new unAuthenticatedError('Incorrect password');
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user: {name : user.name}, token});
}

const signUp = async (req, res) => {
    const user = await User.create({...req.body})
    res.status(StatusCodes.CREATED).json({user});
};

module.exports = {
    signIn, signUp
}