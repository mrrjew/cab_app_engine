import { Schema, model } from 'mongoose';

const mileageSchema = new Schema(
  {
    rider: { type: Schema.Types.ObjectId, required: true, ref: 'rider' },
    value: { type: Number, required: true ,default:0},
    used: { type: Number, default:0},
    transactionId: { type: String },
    reference: { type: String },
    status: {type:String,enum:['PENDING','CREDITED','REJECTED','EXHAUSTED'], default:'PENDING'}
  },
  { timestamps: true }
);

const Mileage = model('Mileage', mileageSchema);
export default Mileage;
