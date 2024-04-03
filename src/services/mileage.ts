import axios from 'axios';
import IService, { IAppContext } from '../types/app';
import config from '../config';

export default class MileageService extends IService {
  private endpoint = 'https://api.paystack.co';
  constructor(props: IAppContext) {
    super(props);
  }

  async getUserCurrentMileage(req, res) {
    try {
      const rider = await this.authenticate_rider(req.user._id);

      const mileage = await this.authenticate_mileage(rider._id);

      return res.status(200).json(mileage);
    } catch (e) {
      return res.status(500).send('error getting mileage');
    }
  }

  async getUserAllMileage(req, res) {
      try {
          const rider = await this.authenticate_rider(req.user._id);
          
      const mileage = await this.models.Mileage.find({rider:rider._id}).sort({ updatedAt: -1 });

      return res.status(200).json(mileage);
    } catch (e) {
      return res.status(500).send(`error getting mileage: ${e}`);
    }
  }

  //buy mileage
  async buyMileage(req, res) {
    const rider = await this.authenticate_rider(req.user._id);

    const { email } = req.body;

    if (rider.email !== email) {
      return res.status(500).send('Wrong user');
    }

    try {
      const response = await axios({
        method: 'post',
        url: `${this.endpoint}/transaction/initialize`,
        headers: {
          Authorization: `Bearer ${config.paystack.secret_key}`,
        },
        data: req.body,
      });

      return res.status(201).json(response.data);
    } catch (e) {
      return res.status(500).send(`error initializing payment: ${e}`);
    }
  }

  // verify payment
  async verifyPayment(req, res) {
    await this.authenticate_rider(req.user._id);

    try {
      const response = await axios({
        method: 'get',
        url: `${this.endpoint}/transaction/verify/${req.body.reference}`,
        headers: {
          Authorization: `Bearer ${config.paystack.secret_key}`,
        },
      });

      const transactionId = response.data.data.id;
      const reference = response.data.data.reference;
      const amount = response.data.data.amount;
      const status = response.data.status;
      const main_status = response.data.data.status;

       if (status && main_status) {
        
        const mileage = await this.models.Mileage.create({
             rider:req.user._id,
             status: 'CONFIRMED',
             transactionId,
             reference,
             value:String(+amount * 1/1.75),
             amount,
         });

         return res.status(201).json(mileage)
       } else if (!status && !main_status) {
         return res.status(500).send('mileage purchase rejected')
       }
    } catch (e) {
      return res.status(500).send(`error verifying payment: ${e}`);
    }
  }

  // pay for ride with milleage
  async payForRide(req, res) {
    const {rideId} = req.body
    const rider = await this.authenticate_rider(req.user._id);

    const mileage = await this.authenticate_mileage(rider._id)

    const ride = await this.authenticate_ride(rideId)

    if(
        mileage.status == 'REJECTED' ||
        mileage.status == 'EXHAUSTED'
    ){
        return res.status(500).send('cannot pay for ride with current mileage')
    }

    if(mileage.value == mileage.used){
        mileage.status = 'EXHAUSTED'
        return res.status(500).send('mileage is finished')
  }

    await ride.updateOne({$set: {status:'COMPLETED'}})
    await ride.save();
    
    await mileage.updateOne({$set: {used: mileage.used + ride.mileage}})
    await mileage.save();

    return res.status(200).json([ride,mileage])
  }

}
