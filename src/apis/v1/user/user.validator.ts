import { celebrate, Joi } from "celebrate";

const phoneNumberRegxRwa = /^2507[2389]\d{7}/;
const phoneNumberRegxKenya = /^2547[2389]\d{7}/;

export const createUser = Joi.object().keys({
    first_name: Joi.string().min(4).max(30).required(),
    last_name: Joi.string().min(4).max(30).required(),
    email:Joi.string().email().required(),
    phone_number: Joi.string().required().regex(phoneNumberRegxRwa)
})

export const loginUser = Joi.object().keys({
    email:Joi.string().email().required(),
    password:Joi.string().required().trim()
})

export const completeRegister = Joi.object().keys({
    code:Joi.string().uuid().required(),
    password:Joi.string().trim().required()
})