import Joi from "joi";
import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtServices from "../../services/JWTServices";
import { REFRESH_SECRET } from "../../config";
import errorMessages from "../../constants/errorMessages";

const refreshController = {
  async refresh(req, res, next) {

    // Validation
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    // database
    let refreshToken;

    try {
      refreshToken = await RefreshToken.findOne({
        token: req.body.refresh_token,
      });


      if (!refreshToken) {
        return next(CustomErrorHandler.unAuthorized(errorMessages.INVALID_REFRESH_TOKEN));
      }
      let userId;
      try {
        const { _id } = await JwtServices.verify(
          refreshToken.token,
          REFRESH_SECRET
        );
        userId = _id;
      } catch (err) {
        return next(CustomErrorHandler.unAuthorized(errorMessages.INVALID_REFRESH_TOKEN));
      }

      const user = await User.findOne({ _id: userId });

      if (!user) {
        return next(CustomErrorHandler.unAuthorized(errorMessages.USER_NOT_FOUND));
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
};

export default refreshController;
