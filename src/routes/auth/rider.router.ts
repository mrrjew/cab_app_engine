import express, { Request, Response } from 'express';
import { IAppContext } from '../../types/app';
import setContext from '../../middlewares/context';
import { appContext} from '../../start';
import Rider from '../../models/user/rider';

const router = express.Router();

router.get('/me',setContext,async (req: Request & { user: any }, res: Response) => {
    console.log(req.user._id)
  const _Rider = await appContext.models.Rider.findById(req.user._id)
  return res.status(200).json(_Rider)
})

router.get('/riders',setContext,async (_:any, res: Response) => {
  const _Rider = await Rider.find()
  res.status(200).json(_Rider)
})

router.post('/register', async (req: Request, res: Response) => {
    const Rider = await appContext.services.RiderService.registerRider(req,res);
    return res.status(201).json({ Rider });
});

router.post('/verify', async(req: Request, res: Response) => {
    const response = await appContext.services.RiderService.verifyRider(req,res);
    return res.status(200).json(response);
});

router.post('/forgot-password', async(req: Request, res: Response) => {
    const response = await appContext.services.RiderService.forgotPassword(req,res);
    return res.status(200).json(response);
});

router.post('/reset-password', async(req: Request, res: Response) => {
    const response = await appContext.services.RiderService.resetPassword(req,res);
    return res.status(200).json(response);
});

router.post('/login', async(req: Request, res: Response) => {
    await appContext.services.RiderService.loginRider(req,res);
});

router.put('/update-rider', setContext, async(req: Request & { user: any }, res: Response) => {
    const Rider = await appContext.services.RiderService.updateRider(req,res);
    return res.status(200).json(Rider);
});

router.delete('/delete-rider',setContext, async(req: Request & { Rider: any }, res: Response) => {
    await appContext.services.RiderService.deleteRider(req,res);
}); 


export default router;
