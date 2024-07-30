import { currentUser, requireAuth } from '@aaron-sg-org/common';
import express, { NextFunction } from 'express';
const router = express.Router();

router.get('/api/users/currentuser', currentUser, async(req, res, next:NextFunction)=>{
    console.log("currentUser visitted");
    return res.status(200).send({currentUser:req.currentUser||null});
})

export {router as currentUserRouter};