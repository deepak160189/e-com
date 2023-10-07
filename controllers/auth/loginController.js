import Joi from "joi";
import bcrypt from "bcrypt";
import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtServices from "../../services/JWTServices";
import { REFRESH_SECRET } from "../../config";

const loginController = {
  async login(req, res, next) {
    // Validation

    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });

    const { error } = loginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email: email });

      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      // Compare the password.
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      // Token
      const access_token = JwtServices.sign({ _id: user._id, role: user.role });
      const refresh_token = JwtServices.sign(
        { _id: user._id, role: user.role },
        "1y",
        REFRESH_SECRET
      );

      await RefreshToken.create({ token: refresh_token });

      res.json({ access_token, refresh_token });
    } catch (err) {
      return next(err);
    }
  },

  async logout(req, res, next) {
    // Validation
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      await RefreshToken.deleteOne({ token: req.body.refresh_token });
      res.json({ status: 1 });
    } catch (err) {
      return next(err.messages);
    }
  },
};

export default loginController;
