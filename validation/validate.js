const Joi = require("joi");

// Schema for validating user registration
const userRegistrationSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.base": "Username should be a type of text",
    "string.empty": "Username cannot be an empty field",
    "string.min": "Username should have a minimum length of {#limit}",
    "string.max": "Username should have a maximum length of {#limit}",
    "any.required": "Username is required",
  }),

  password: Joi.string().min(6).max(100).required().messages({
    "string.base": "Password should be a type of text",
    "string.empty": "Password cannot be an empty field",
    "string.min": "Password should have a minimum length of {#limit}",
    "string.max": "Password should have a maximum length of {#limit}",
    "any.required": "Password is required",
  }),

  email: Joi.string().email().required().messages({
    "string.base": "Email should be a type of text",
    "string.empty": "Email cannot be an empty field",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),

  city: Joi.string().min(2).max(50).optional().messages({
    "string.base": "City should be a type of text",
    "string.empty": "City cannot be an empty field",
    "string.min": "City should have a minimum length of {#limit}",
    "string.max": "City should have a maximum length of {#limit}",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().min(3).max(30).required().messages({
    "string.base": "Username should be a type of text",
    "string.empty": "Username cannot be an empty field",
    "string.min": "Username should have a minimum length of {#limit}",
    "string.max": "Username should have a maximum length of {#limit}",
    "any.required": "Username is required",
  }),

  password: Joi.string().min(6).required().messages({
    "string.base": "Password should be a type of text",
    "string.empty": "Password cannot be an empty field",
    "string.min": "Password should have a minimum length of {#limit}",
    "any.required": "Password is required",
  }),
});

const contactSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.base": "Username should be a type of text",
    "string.empty": "Username cannot be an empty field",
    "string.min": "Username should have a minimum length of {#limit}",
    "string.max": "Username should have a maximum length of {#limit}",
    "any.required": "Username is required",
  }),
  email: Joi.string().min(3).max(30).required().messages({
    "string.base": "Username should be a type of text",
    "string.empty": "Username cannot be an empty field",
    "string.min": "Username should have a minimum length of {#limit}",
    "string.max": "Username should have a maximum length of {#limit}",
    "any.required": "Username is required",
  }),
});

module.exports = { userRegistrationSchema, loginSchema, contactSchema };
