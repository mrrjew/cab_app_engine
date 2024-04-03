import { Schema, model } from 'mongoose';

const mileageSchema = new Schema(
  {
    rider: { type: Schema.Types.ObjectId, required: true, ref: 'rider' },
    value: { type: String, required: true },
    amount: { type: String, required: true },
    used: { type: String},
    transactionId: { type: String },
    reference: { type: String },
    status: {type:String,enum:['PENDING','CONFIRMED','REJECTED','EXHAUSTED'], default:'PENDING'}
  },
  { timestamps: true }
);

const Mileage = model('Mileage', mileageSchema);
export default Mileage;
