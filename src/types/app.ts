import { IModels } from '../models';
import { IServices } from '../services';
export interface IAppContext {
  models?: IModels;
  services?: IServices;
}

export default class IService {
  models?: IModels;
  context?: IAppContext;
  constructor(context: IAppContext) {
    this.models = context.models;
    this.context = context;
  }

  async authenticate_rider(userId: any) {
    const driver = await this.context.models.Rider.findById(userId);
    console.log(driver)
    if (!driver) {
      throw new Error('User not authenticated');
    }

    return driver
  }

  async authenticate_ride(rideId: any) {
    const ride = await this.context.models.Ride.findOne({ _id: rideId });

    if (!ride) {
      throw new Error('no ride found');
    }

    return ride
  }

}
