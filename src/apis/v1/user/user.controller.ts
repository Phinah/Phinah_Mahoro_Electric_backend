import { Request, Response } from "express";
import { Op } from "sequelize";
import { Role } from "../../../database/models/role.model";
import { Token } from "../../../database/models/token.model";
import { User } from "../../../database/models/user.model";
import { UserRole } from "../../../database/models/user_role.model";
import AuthHelper from "../../../helpers/auth.helper";
import jsonResponse from "../../../helpers/json.response";
import { Roles } from "../../../utils/constants/roles";
import { BAD_REQUEST, CONFLICT, FORBIDDEN, OK, SERVER_ERROR, UNAUTHORIZED } from "../../../utils/constants/statusCode";

export class UserController{
    static async registerUser(req:Request,res:Response){
        try {
            const {first_name, last_name, phone_number, email} = req.body
            let user:any = await User.findOne({
                where:{
                    [Op.or]:[
                        {email:email},
                        {phone_number:phone_number}
                    ]
                }
            })
            if(user) {
                return jsonResponse({
                    res,
                    success:false,
                    status: BAD_REQUEST,
                    message: 'Phone Number Or Email Already Taken',
                })
            }     
            user = await User.create({
                first_name:first_name,
                last_name:last_name,
                email:email,
                phone_number:phone_number,
                password:'1234'
            })
            const role = await Role.findOne({
                where:{
                    name:Roles.USER
                }
            })
            if(!role){
                return jsonResponse({
                    res,
                    status:SERVER_ERROR,
                    success:false,
                    message: `Dear Admin Something Wrong with User Role Contact Dev Team`
                })
            }

            let user_role = await UserRole.findOne({
                where:{
                    user_id:user?.get().id,
                    status:'active'
                }
            })
            if(user_role){
                return jsonResponse({
                    res,
                    success:false,
                    status: BAD_REQUEST,
                    message: 'User Role Already Exist',
                })
            }
            user_role = await UserRole.create({
                user_id:user?.get().id,
                role_id:role?.get().id
            })
            const {password: _, ...data } = user.get()
            const token = await AuthHelper.generateToken({
                id:user.id,
                phone_number:user.phone_number,
                email:user.email,
            })
            const found_token = await Token.findOne({
                where:{
                    token:token
                }
            })
            return jsonResponse({
                res,
                success:true,
                status: OK,
                data: {
                    enter_code: found_token?.get().id,
                },
              });
            
        } catch (error) {
            return jsonResponse({
                res,
                status:CONFLICT,
                success:false,
                message:`Error ${error}`
            })
        }
    }
    static async completeRegisteration(req:any, res:Response){
        try {
            const {code, password} = req.body;
            const token = await Token.findOne({
                where:{
                    id:code,
                    status:'active'
                }
            })
            if(!token){
                return jsonResponse({
                    res,
                    status:CONFLICT,
                    success:false,
                    message:`Suspicious Action`
                })
            }
            const user = await User.findOne({
                where:{
                    id:token?.get().user_id
                }
            })
            if(!user){
                return jsonResponse({
                    res,
                    status:CONFLICT,
                    success:false,
                    message:`Suspicious Action`
                }) 
            }

            await user?.update({
                password:AuthHelper.hashPassword(password)
            })
            await token?.update({
                status:'logout'
            })

            return jsonResponse({
                res,
                status:OK,
                success:true,
                message:'Password Added Successfully'
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
    static async login(req:any, res:Response){
        try {
            const { email, password } = req.body
            const user = await User.findOne({
                where:{
                    email:email
                }
            })
            if(!user){
                return jsonResponse({
                    res,
                    success:false,
                    status:UNAUTHORIZED,
                    message:'Incorrect Email or Password'
                })
            }

            const user_role = await UserRole.findOne({
                where:{
                    user_id: user?.get().id,
                    status:'active'
                }
            })
            if(!user_role){
                return jsonResponse({
                    res,
                    success:false,
                    status:CONFLICT,
                    message:'Unknown User'
                })
            }
            const {password: _, ...data } = user.get()
            if(!AuthHelper.comparePassword(password, user.get().password)){
                return jsonResponse({
                    res,
                    success:false,
                    status:UNAUTHORIZED,
                    message:'Email or Password does not match'
                })
            }
            if(user.status !== 'active'){
                return jsonResponse({
                    res,
                    success:false,
                    status:FORBIDDEN,
                    message:'Forbiden Access'
                })
            }
    
            const token:any = await AuthHelper.generateToken({
                id:user.id,
                phone_number:user.phone_number,
                email:user.email,
            })
    
            return jsonResponse({
                res,
                success:true,
                status:OK,
                data:{
                    ...data,
                    token
                }
            })
        } catch (error) {
            return jsonResponse({
                res,
                success:false,
                status:SERVER_ERROR,
                message:`Error ${error}`
            })
        }
    }
    static async logout(req:any, res:Response){
        try {
            const { token } = req;
            const token_logout = await Token.findOne({
                where:{
                    token:token,
                    status:'active'
                }
            })
            await token_logout?.update({
                status:'logout'
            })
            return jsonResponse({
                res,
                success:true,
                status:OK,
                message:'Logged Out Successfully'
            })
        } catch (error) {
            return jsonResponse({
                res,
                success:false,
                status:SERVER_ERROR,
                message:`Error ${error}`
            })
        }
        
    }
}