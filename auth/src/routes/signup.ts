import express, { NextFunction, Request, Response } from 'express';
import { User } from '../models/user';
import { body, validationResult } from 'express-validator';
import { RequestValidationError, BadRequestError } from '@aaron-sg-org/common';
import jwt from "jsonwebtoken";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_KEY: string;
        }
    }
}

require('express-async-errors');

const router = express.Router();

router.post('/api/users/signup',[
    body('email')
    .isEmail()
    .withMessage("Invalid email"),
    body('password')
    .trim()
    .isLength({min:4, max:20})
    .withMessage("Password must be between 4 and 20 characters")
],async(req:Request, res: Response, next:NextFunction)=>{
    try{
    console.log('session body',req.session);
    
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return next(new RequestValidationError(errors.array()));
    }

    const existUser = await User.findOne({email:req.body.email})
    if(existUser){
        return next (new BadRequestError('Email in use!'));
    }
    const newUser = User.build(req.body);
    await newUser.save();
    
    const token = jwt.sign({
        id: newUser.id,
        email: newUser.email
    },process.env.JWT_KEY);

    req.session = {
        jwt: token
    };

    return res.status(201).send(newUser);
}catch(error){
    if ((error instanceof RequestValidationError)||(error instanceof BadRequestError)){
        return next(error);
    }else{
        console.log(error);
        throw new BadRequestError("Internal Server Error");
    }
}
})

export {router as signupRouter};