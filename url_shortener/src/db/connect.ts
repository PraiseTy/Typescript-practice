// import mongoose from "mongoose";

// const connectDB = async (url: string) => {
//   try {
//     await mongoose.connect(url);
//     console.log("MongoDB connected");
//   } catch (error) {
//     console.log("Error:", error);
//   }
// };

// export default connectDB;
require("dotenv").config();
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.db_user,
  host: process.env.db_host,
  password: process.env.db_password,
  database: process.env.db,
  port: 5432,
});

export default pool;
