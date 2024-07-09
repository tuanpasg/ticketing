import express, { Request,Response, NextFunction } from 'express';
import { body,validationResult } from 'express-validator';
import { User } from '../models/user';
import { BadRequestError } from '@aaron-sg-org/common';
import { Password } from '../services/password';
import { validateRequest } from '@aaron-sg-org/common';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signin',
[
    body('email')
    .isEmail()
    .withMessage("Invalid email"),
    body('password')
    .trim()
    .isLength({min:4, max:20})
    .withMessage("Password must be between 4 and 20 characters")
],
validateRequest,
async(req:Request, res:Response, next: NextFunction)=>{
    const {email, password} = req.body;

    const existingUser = await User.findOne({email:email});
    
    if(!existingUser){
        return next(new BadRequestError('Wrong email!'));
    }

    const passwordVerifyResult = await Password.compare(existingUser.password,password);
    if(!passwordVerifyResult){
        return next(new BadRequestError('Wrong password'))
    }
    
    console.log(existingUser,email,password);

    const token = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    },process.env.JWT_KEY);
    
    req.session = {
        jwt: token
    };

    return res.status(200).send(existingUser);
})

export {router as signinRouter};