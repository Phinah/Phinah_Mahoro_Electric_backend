import { Request, Response } from "express";
import { Meter } from "../../database/models/meter.model";
import { Token } from "../../database/models/token.model";
import { calculateExpirationDate } from "../../helpers/calculate";
import jsonResponse from "../../helpers/json.response";
import { CONFLICT, CREATED } from "../../utils/constants/statusCode";

export class TokenController{
    static async getToken(req:Request,res:Response){
        try {
            const {amount, meter_number} = req.body;
            
            let meter = await Meter.findOne({
                where:{
                    meter:meter_number,
                }
            })
            if (!meter){
                meter = await Meter.create({
                    meter:meter_number
                })
            }

            let token = await Token.findOne({
                where:{
                    meter_id:meter.get().id,
                    status:'active'
                }
            })

            if(token){
                return jsonResponse({
                    res,
                    status:CONFLICT,
                    success:false,
                    message: `Meter Already Have Active Token`
                })
            }

            const expired_at = calculateExpirationDate(amount)            
            if(!expired_at){
                return jsonResponse({
                    res,
                    status:CONFLICT,
                    success:false,
                    message:` Amount number not valid`
                })
            }

            token = await Token.create({
                meter_id:meter.get().id,
                amount:amount,
                expired_at:expired_at
            })
            const data = {
                meter:meter.get().meter,
                amount:amount,
                token: token.get().token,
                days:token.get().expired_at
            }
            return jsonResponse({
                res,
                status:CREATED,
                success:true,
                data:{
                    ...data
                }
            })

        } catch (error) {
            return jsonResponse({
                res,
                status:CONFLICT,
                success:false,
                message:`Error ${error}`
            })
        }
    }
    static async getRemaingDays(req:Request, res:Response){
        try {
            const {token} = req.params
            const days = await Token.findOne({
                where:{
                    token:token,
                    status:'active'
                },
                attributes:[
                    'expired_at','token'
                ]
            })
            return jsonResponse({
                res,
                status:CREATED,
                success:true,
                data:{
                    ...days?.get()
                }
            })


        } catch (error) {
            
        }
    }
}