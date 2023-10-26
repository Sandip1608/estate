import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();

export const signup = async(req, res, next) => {
    const {username, email, password} = req.body
    const hashPassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({username, email, password: hashPassword})
    try{
        await newUser.save()
        res.status(201).json("User created sucessfully !!!")
    }catch(err){
        next(err)
    }

}

export const signin = async (req, res, next) => {
    const {email, password} =req.body
    try{
        const validEmail = await User.findOne({email})
        if (!validEmail) return next(errorHandler(404, 'email not found !!!'))
        const validPassword = bcryptjs.compareSync(password, validEmail.password)
        if (!validPassword) return next(errorHandler(404, 'password didnt match !!!'))
        const token = jwt.sign({id: validEmail._id}, process.env.JWT_SECRET)
        const {password: pass, ...rest} = validEmail._doc
        res.cookie('access_token', token, {httpOnly:true}).status(200).json(rest)
    }catch(err){
        next(err)
    }
}