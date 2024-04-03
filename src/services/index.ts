import { IAppContext } from '../types/app';

//user
import RiderService from './auth/rider';
import RiderSessionService from '../services/auth/session/rider.session';
import RideService from '../services/ride'
import { server } from '../start';
import MileageService from './mileage';

export interface IServices {
  RiderService: RiderService;
  RiderSessionService:RiderSessionService;
  RideService:RideService
  MileageService:MileageService
}


export default async function initServices(context: IAppContext): Promise<IServices> {
  return {
    RiderService: new RiderService(context),
    RiderSessionService: new RiderSessionService(context),
    RideService: new RideService(context,server),
    MileageService: new MileageService(context)
  };
}
