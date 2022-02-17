import { Request, Response } from "express";
import { Role } from "../../../database/models/role.model";
import jsonResponse, { ResponseParams } from "../../../helpers/json.response";
import { BAD_REQUEST, CREATED } from "../../../utils/constants/statusCode";



export class RoleController{
    static async addRole(req:Request, res:Response){
        try {
            const {name, details} = req.body
            const role = await Role.create({
                name:name,
                details:details
            })

            return jsonResponse({
                res,
                status:CREATED,
                success:true,
                data:{
                    ...role.get()
                }
            })
            
        } catch (error) {
            return jsonResponse({
                res,
                status:BAD_REQUEST,
                success:false,
                message:`Error occured ${error}`
            })
        }
    }
    
}