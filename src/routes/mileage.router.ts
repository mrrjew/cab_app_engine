import express, { Request, Response } from 'express'
import setContext from '../middlewares/context'
import { appContext } from '../start'
const router = express.Router()

router.get('/current-mileage',setContext,async function(req:Request & {user:any}, res:Response){
    await appContext.services.MileageService.getUserCurrentMileage(req,res)
})

router.get('/all-mileages',setContext,async function(req:Request & {user:any}, res:Response){
    await appContext.services.MileageService.getUserAllMileage(req,res)
})
router.post('/buy-mileage',setContext,async function(req:Request & {user:any}, res:Response){
    await appContext.services.MileageService.buyMileage(req,res)
})
router.post('/verify-payment',setContext,async function(req:Request & {user:any}, res:Response){
    await appContext.services.MileageService.verifyPayment(req,res)
})
router.post('/pay-for-ride',setContext,async function(req:Request & {user:any}, res:Response){
    await appContext.services.MileageService.payForRide(req,res)
})

export default router