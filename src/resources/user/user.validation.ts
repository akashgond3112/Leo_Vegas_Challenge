import Joi from 'joi';

const register = Joi.object({
    name: Joi.string().max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().required(),
});

const login = Joi.object({
    email: Joi.string().required(),

    password: Joi.string().required(),
});

const updateUser = Joi.object({
    name: Joi.string().max(30).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    role: Joi.string().min(6).optional(),
});

export default { register, login, updateUser };