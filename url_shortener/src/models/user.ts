import { UUID } from "crypto";
import pool from "../db/connect";
import { Pool, QueryResult } from "pg";
import bcrypt from "bcryptjs";
import { v4 as uuid4 } from "uuid";
import * as jwt from "jsonwebtoken";

export interface User {
  id: UUID;
  email: string;
  password: string;
}

export class userModel {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.createUserTable();
  }

  async createUser(user: Omit<User, "id">): Promise<User | null> {
    const { email, password } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const queryText =
      'INSERT INTO "user" (email, password) VALUES ($1, $2) RETURNING *';
    const values = [email, hashedPassword];
    try {
      const { rows } = await this.pool.query(queryText, values);
      return rows[0];
    } catch (err) {
      console.log({ "There was an error creating the user table: ": err });
      return null;
    }
  }

  async createUserTable(): Promise<void> {
    const createUserQuery = `CREATE TABLE IF NOT EXISTS "user" (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
        )`;

    try {
      await this.pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
      await this.pool.query(createUserQuery);
      console.log("User database table created sucessfully");
    } catch (error) {
      console.log("Unexpected Error: ", error);
    }
  }

  generateAuthTokens(user: User): string {
    const tokens = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "",
      { expiresIn: process.env.JWT_LIFETIME }
    );
    return tokens;
  }

  async comparePassword(
    userPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(userPassword, hashedPassword);
  }

  async loginUser(email: string, password: string): Promise<User | null> {
    const queryText = 'SELECT * from "user" WHERE email = $1';
    const values = [email];
    try {
      const { rows } = await this.pool.query(queryText, values);
      if (rows.length == 0) {
        return null;
      }
      const user = rows[0];

      const checkPassword = await bcrypt.compare(password, user.password);

      if (!checkPassword) {
        return null;
      }

      return user;
    } catch (err) {
      console.log({ "Error in logging in user:": err });
      return null;
    }
  }
}

export default userModel;
