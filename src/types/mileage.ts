import { Types } from "mongoose";

export interface IMileage{
    rider:Types.ObjectId
    transactionId?:string
    reference?:string
    value:string
    amount:string
    used?:string
    status:'PENDING' | 'CONFIRMED' | 'REJECTED' | 'EXHAUSTED'
}

export interface IMileageDocument extends IMileage,Document{
    _id:Types.ObjectId;
    createdAt:Date;
    created:Date;
}