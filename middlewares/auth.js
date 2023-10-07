import CustomErrorHandler from "../services/CustomErrorHandler";
import JwtServices from "../services/JWTServices";

const auth = async (req, res, next) => {
  let authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return next(CustomErrorHandler.unAuthorized());
  }

  const token = authHeader.split(" ")[1];

  try {
    const { _id, role } = await JwtServices.verify(token);
    req.user = { _id, role };
    next();
  } catch (err) {
    return next(CustomErrorHandler.unAuthorized());
  }
};

export default auth;
