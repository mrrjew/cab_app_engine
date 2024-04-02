import express, { Request, Response } from 'express';
import { appContext } from '../../../start';

const router = express.Router();

router.post('/create', async (req: Request, res: Response) => {
  try {
    await appContext.services.RiderSessionService.createUserSession(req, res);
  } catch (e) {
    res.status(500).send('Error creating token');
  }
});

router.get('/getrefreshtoken', async (req: Request, res: Response) => {
  try {
    await appContext.services.RiderSessionService.createUserSession(req, res);
  } catch (e) {
    res.status(500).send('Error creating token');
  }
});

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    await appContext.services.RiderSessionService.refreshAccessToken(res, token);
  } catch (e) {
    res.status(500).send('Error creating token');
  }
});

export default router;
