import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

class JwtServices {
  static sign(payload, expire = "60s", secret = JWT_SECRET) {
    return jwt.sign(payload, secret, { expiresIn: expire });
  }

  static verify(token , secret = JWT_SECRET) {
    return jwt.verify(token, secret);
  }
}


export default JwtServices;