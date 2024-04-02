import express from 'express';
import auth from './auth'
import ride from './ride.router'

const router = express.Router()

router.use('/auth',auth)
router.use('/ride',ride)


export default router