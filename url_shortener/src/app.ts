import dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
import pool from "./db/connect";
import router from "./routes/url";
import userRouter from "./routes/user";

const app: Application = express();
const port: number = 3001;

app.use(express.json());
app.use(express.urlencoded());

app.use("/api/v1/", router);
app.use("/api/v1/", userRouter);

app.get("/", (req, res) => {
  res.send({ msg: "ok" });
});

//Check if env variable is defined before passing it to connectDB function to avoid error
// const mongodbUrl = process.env.MONGO_URI || "default_mongodb_uri";

// const start = async () => {
//   try {
//     await connectDB(mongodbUrl);
//     app.listen(port, () => {
//       console.log(`App is listening on port ${port}`);
//       console.log(`DB: ${mongodbUrl}`);
//     });
//   } catch {}
// };

const start = async () => {
  const client = await pool.connect();
  try {
    app.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });
  } catch {}
};

start();
