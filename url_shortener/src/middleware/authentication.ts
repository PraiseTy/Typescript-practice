import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthenicationRequest extends Request {
  user?: { id: string; email: string };
}

const auth = async (
  req: AuthenicationRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization?.trim();

  if (!authHeader || authHeader.startsWith(" Bearer ")) {
    res.status(401).json({ error: "Given Token not valid" });
  }

  const token = authHeader?.split(" ")[1] ?? "";

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as JwtPayload;
    req.user = {
      id: payload.id,
      email: payload.email,
    };
    next();
  } catch (err) {
    return res.status(401).json({ err: "Invalid token" });
  }
};

export default auth;
