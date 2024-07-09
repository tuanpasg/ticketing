import { currentUser, requireAuth } from '@aaron-sg-org/common';
import express, { NextFunction } from 'express';
const router = express.Router();

router.get('/api/users/currentuser', currentUser, requireAuth, async(req, res, next:NextFunction)=>{
    return res.status(200).send({currentUser:req.currentUser||null});
})

export {router as currentUserRouter};