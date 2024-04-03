import { Number, Types } from "mongoose";

export interface IMileage{
    rider:Types.ObjectId
    transactionId?:string
    reference?:string
    value:number
    used?:number
    status:'PENDING' | 'CREDITED' | 'REJECTED' | 'EXHAUSTED'
}

export interface IMileageDocument extends IMileage,Document{
    _id:Types.ObjectId;
    createdAt:Date;
    created:Date;
}