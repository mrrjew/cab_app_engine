import express from 'express';
import rider from './rider.router';
import session from './session/rider.session.router';
import googleOAuth from './rider.googleOauth.router';

const router = express.Router()

router.use('/rider', rider);
router.use('/session', session);
router.use(googleOAuth)

export default router