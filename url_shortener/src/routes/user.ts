import express from "express";
import userFunctions from "../controllers/user";
const { createNewUser, loginUsers } = userFunctions;

const userRouter = express.Router();

userRouter.post("/create_user", createNewUser);
userRouter.post("/login", loginUsers);

export default userRouter;
