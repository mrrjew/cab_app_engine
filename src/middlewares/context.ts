import { NextFunction } from 'express';
import { verifyJwt } from '../utils/token';
import { Request,Response } from 'express';

export default async function setContext (req:Request & {user:{_id:string}},res:Response,next:NextFunction){
  try {
    let token = req.headers.authorization.split(' ')[1]
    let decoded:any;

    if (token) {
      try{
        decoded = await verifyJwt(token);
      }catch(e){
        throw new Error(`error decoding token: ${e}`)
      }
      
      const id = decoded._id;
      
      const user = { _id: id };
      user ? req.user = user : null;
      next()
    }
  } catch (err) {
    console.log(err);
  }
};
