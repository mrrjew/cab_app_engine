import express,{Request,Response} from "express"
import { appContext } from "../start"
import setContext from "../middlewares/context"

const router = express.Router()

router.get('/rider-ride-history',setContext, async function(req:Request & {user:any}, res:Response){
    const rides = await appContext.models.Ride.find({rider:req.user._id})
    return res.status(200).json(rides)
})

router.post('/ride-request', setContext,async function(req:Request & {user:any}, res:Response){
    await appContext.services.RideService.requestRide(req,res)
})

router.post('/update-ride/:id', setContext, async function (req: Request & { user: any }, res: Response) {
  await appContext.services.RideService.updateRide(req, res);
});

router.post('/delete-ride/:id', setContext, async function (req: Request & { user: any }, res: Response) {
  await appContext.services.RideService.deleteRide(req, res);
});

export default router