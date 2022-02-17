import { Joi } from "celebrate";
import { Roles } from "../../../utils/constants/roles";

export const addRole = Joi.object().keys({
    name:Joi.string().valid(Roles.USER,Roles.ADMIN,Roles.SUPER_ADMIN).required(),
    details :Joi.string().min(4).max(30).required()
})