import express from 'express';
import auth from './auth'
import ride from './ride.router'
import mileage from './mileage.router'

const router = express.Router()

router.use('/auth',auth)
router.use('/ride',ride)
router.use('/mileage',mileage)


export default router