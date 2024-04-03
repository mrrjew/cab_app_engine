import axios from 'axios';
import IService, { IAppContext } from '../types/app';
import config from '../config';
import {v4} from "uuid"

export default class MileageService extends IService {
  private endpoint = 'https://api.paystack.co';
  private async calculateMileage(amount) {
    return Number(+amount * (1 / 1.75));
  }

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

      const mileage = await this.models.Mileage.find({ rider: rider._id }).sort({ updatedAt: -1 });

      return res.status(200).json(mileage);
    } catch (e) {
      return res.status(500).send(`error getting mileage: ${e}`);
    }
  }

  //buy mileage
  async buyMileage(req, res) {
    const rider = await this.authenticate_rider(req.user._id);

    const { email } = req.body;
    const reference = v4()

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
        data: {...req.body,reference},
      });

      return res.status(201).json(response.data);
    } catch (e) {
      return res.status(500).send(`error initializing payment: ${e}`);
    }
  }
// Define a flag to track whether payment has been verified and mileage value created

async verifyPayment(req, res) {
  let paymentVerified = false;
  await this.authenticate_rider(req.user._id);

  try {
    // Check if payment has already been verified
    if (paymentVerified) {
      return res.status(200).json({ message: 'Payment already verified' });
    }

    const response = await axios({
      method: 'get',
      url: `${this.endpoint}/transaction/verify/${req.body.reference}`,
      headers: {
        Authorization: `Bearer ${config.paystack.secret_key}`,
      },
    });

    const { id: transactionId, reference, amount, status } = response.data.data;

    if (status) {
      let mileage = await this.models.Mileage.findOne({ rider: req.user._id });

      if (!mileage) {
        const newMileageData = {
          rider: req.user._id,
          status: 'CREDITED',
          transactionId,
          reference,
          value: await this.calculateMileage(amount),
          amount,
        };
        mileage = await this.models.Mileage.create(newMileageData);
      } else {
        mileage.value += await this.calculateMileage(amount);
        await mileage.save();
      }

      // Set paymentVerified flag to true after successful verification and mileage value creation
      paymentVerified = true;

      return res.status(201).json(mileage);
    } else {
      return res.status(500).send('mileage purchase rejected');
    }
  } catch (error) {
    return res.status(500).send(`error verifying payment: ${error}`);
  }
}

  // pay for ride with milleage
  async payForRide(req, res) {
    const { rideId } = req.body;
    const rider = await this.authenticate_rider(req.user._id);

    const mileage = await this.context.models.Mileage.findOne({ rider: req.user._id }).sort({ updatedAt: -1 });

    const ride = await this.authenticate_ride(rideId);

    if (mileage.status == 'REJECTED' || mileage.status == 'EXHAUSTED') {
      return res.status(500).send('cannot pay for ride with current mileage');
    }

    if (ride.status == 'COMPLETED') {
      return res.status(500).send('already paid for trip');
    }

    if (mileage.value == 0) {
      mileage.status = 'EXHAUSTED';
      mileage.used = 0;
      return res.status(500).send('mileage is finished');
    }

    if (ride.mileage > mileage.value) {
      return res.status(500).send('ride mileage is greater than your current mileage');
    }

    await mileage.updateOne({
      $set: {
        value: mileage.value - Number(ride.mileage),
        used: Number(ride.mileage),
      },
    });
    await mileage.save();

    await ride.updateOne({ $set: { status: 'COMPLETED' } });
    await ride.save();

    return res.status(200).json([ride, mileage]);
  }
}
