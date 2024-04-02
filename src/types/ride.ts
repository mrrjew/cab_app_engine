import { Document, Types } from "mongoose"

export interface IRide {
    driver:Types.ObjectId
    rider:Types.ObjectId
    status:"PENDING" | "ONGOING" | "COMPLETED" | "CANCELLED"
    fare:string
    pickupLocation:{
        longitude:string
        latitude:string
        address?:string
    },
    destination:{
        longitude:string
        latitude:string
        address?:string
    },
    distance?:string
}

export interface IRideInput {
    driver:Types.ObjectId
    rider:Types.ObjectId
    status:string
    fare:string
    pickupLocation:{
        longitude:string
        latitude:string
        address?:string
    },
    destination:{
        longitude:string
        latitude:string
        address?:string
    },
    distance?:string
}

export interface IRideDocument extends IRide,Document{
    _id:Types.ObjectId
    createdAt:Date
    updatedAt:Date
}