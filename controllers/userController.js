const User = require("../models/user");
const sendToken = require("../utils/jwt");
const joi = require("joi");
const CustomErrorHandler = require("../middlewares/CustomErrorHandler");

const userController = {
  async register(req, res, next) {
    try {
      const registerSchema = joi.object({
        firstname: joi.string().required().max(20),
        lastname: joi.string().required().max(20),
        password: joi.string().min(6).max(10).required(),
        email: joi.string().email().required(),
      });

      // check all fields are valid or not
      const { error } = registerSchema.validate(req.body);

      if (error) {
        return next(error);
      }

      const { firstname, lastname, password, email } = req.body;

      // check wheather email is taken or not
      const isEmailTaken = await User.findOne({ email });

      if (isEmailTaken) {
        return next(
          CustomErrorHandler.AlreadyExists("This email is already taken")
        );
      }

      const user = await User.create({ firstname, lastname, password, email });

      sendToken(user, 201, res);
    } catch (error) {
      console.log(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const loginSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
      });

      const { error } = loginSchema.validate(req.body);

      if (error) {
        return next(error);
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(CustomErrorHandler.notFound("User not found"));
      }

      const isPasswordMatched = await user.comparePassword(password);

      if (!isPasswordMatched) {
        return next(CustomErrorHandler.notFound("User not found"));
      }

      sendToken(user, 200, res);
    } catch (error) {
      console.log(error);
    }
  },

  async logOut(req, res, next) {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });

      res.status(200).json({
        message: "logged out successfully",
      });
    } catch (error) {
      console.log(error);
    }
  },
};
module.exports = userController;
