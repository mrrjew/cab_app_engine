import express,{Request,Response} from "express"
import { appContext } from "../start"
import setContext from "../middlewares/context"

const router = express.Router()

router.get('/rider-ride-history',setContext, async function(req:Request & {user:any}, res:Response){
    const rides = await appContext.models.Ride.find({rider:req.user._id})
    return res.status(200).json(rides)
  })
  
  router.get('/current-ride', setContext, async function (req: Request & { user: any }, res: Response) {
    try{
    const rides = await appContext.models.Ride.find({rider:req.user._id})
  //   const ride = await appContext.models.Ride.findOne({
  //   $and: [{ riderId: req.user._id }, { $or: [{ status: 'PENDING' }, { status: 'ONGOING' }] }],
  // });
  const ride = [...rides].reverse()[0]

  return res.status(200).json(ride)
  }catch(e){
    return res.status(500).json({error:`error getting current ride: ${e}`})
  }
});

router.post('/ride-request', setContext,async function(req:Request & {user:any}, res:Response){
    await appContext.services.RideService.requestRide(req,res)
})

router.put('/update-ride', setContext, async function (req: Request & { user: any }, res: Response) {
  await appContext.services.RideService.updateRide(req, res);
});

router.put('/cancel-ride', setContext, async function (req: Request & { user: any }, res: Response) {
  await appContext.services.RideService.cancelRide(req, res);
});

export default router