import userModel from "../models/user";
import { Request, Response } from "express";
import pool from "../db/connect";

const userModels = new userModel(pool);
const createNewUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const users = await userModels.createUser({ email, password });

    if (!users) {
      res.status(404).json({ error: "User cannot be found" });
    }

    return res
      .status(201)
      .json({ data: users, message: "User created sucessfully" });
  } catch (err) {
    res.status(500).json({ "There was an error logging the user: ": err });
  }
};

const loginUsers = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userPromise = userModels.loginUser(email, password);

    const users = await userPromise;

    if (!users) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordMatch = await userModels.comparePassword(
      password,
      users.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    const token = userModels.generateAuthTokens(users);

    return res.status(200).json({
      message: "User Login Successful",
      data: { access_token: token, email: users.email },
    });
  } catch (err) {
    return res.status(500).json({ "User cannot be logged in: ": err });
  }
};

export default { createNewUser, loginUsers };
