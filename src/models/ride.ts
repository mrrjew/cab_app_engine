import mongoose, { Schema } from "mongoose";
import { IRideDocument } from "../types/ride";

const rideSchema = new mongoose.Schema<IRideDocument>(
  {
    driver: { type: Schema.Types.ObjectId, ref: 'Driver' },
    rider: { type: Schema.Types.ObjectId, required: true, ref: 'Rider' },
    status: { type: String, enum: ['PENDING', 'ONGOING', 'COMPLETED', 'CANCELLED'], default: 'PENDING' },
    mileage: { type: Number, required: true },
    pickupLocation: {
      longitude: { type: String, required: true },
      latitude: { type: String, required: true },
      address: { type: String },
    },
    destination: {
      longitude: { type: String, required: true },
      latitude: { type: String, required: true },
      address: { type: String },
    },
    distance: {
      text: { type: String, required: true },
      value: { type: String, required: true },
    },
    duration: {
      text: { type: String, required: true },
      value: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const Ride = mongoose.model("Ride",rideSchema)
export default Ride