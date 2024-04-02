import mongoose, { Schema } from "mongoose";

const rideSchema = new mongoose.Schema({
    driver:{type: Schema.Types.ObjectId, required:true, ref: "User"},
    rider:{type: Schema.Types.ObjectId, required:true, ref: "User"},
    status:{type:String, enum:["PENDING" , "ONGOING" , "COMPLETED" , "CANCELLED"], default:"PENDING"},
    fare:{type:String, required:true},
    pickupLocation:{
        longitude:{type:String , required:true},
        latitude:{type:String , required:true},
        address:{type:String},
    },
    destination:{
        longitude:{type:String , required:true},
        latitude:{type:String , required:true},
        address:{type:String},
    },
    distance:{type:String}
},{timestamps:true})

const Ride = mongoose.model("Ride",rideSchema)
export default Ride