import pool from "../db/connect";
import { Pool, QueryResult } from "pg";

export interface Url {
  id: number;
  original_url: string;
  shortened_url: string;
}

export class UrlModel {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.createUrlTable();
  }
  async createUrl(url: Omit<Url, "id">): Promise<Url | null> {
    const queryText =
      "INSERT INTO url (original_url, shortened_url) VALUES ($1, $2) RETURNING *";
    const values = [url.original_url, url.shortened_url];

    try {
      const { rows } = await pool.query<Url>(queryText, values);
      return rows[0];
    } catch (error) {
      console.error("Error creating URL:", error);
      return null;
    }
  }

  async createUrlTable(): Promise<void> {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS url (
      id SERIAL PRIMARY KEY,
      original_url TEXT NOT NULL,
      shortened_url TEXT NOT NULL
    )
  `;

    try {
      await this.pool.query(createTableQuery);
      console.log("url table created or already exists");
    } catch (error) {
      console.error("Error creating 'url' table:", error);
    }
  }

  async findAll(): Promise<Url[]> {
    const queryText = "SELECT * FROM url"; // Correct the SQL query
    try {
      const { rows } = await this.pool.query<Url>(queryText);
      return rows;
    } catch (err) {
      console.error("Error fetching all URLs:", err);
      return [];
    }
  }

  async findOne(id: number): Promise<Url | null> {
    const queryText = "SELECT * from url WHERE id = $1";
    const values = [id];

    try {
      const { rows } = await this.pool.query<Url>(queryText, values);
      return rows[0] || null;
    } catch (err) {
      console.error({ "Error fetching a single url": err });
      return null;
    }
  }

  async deleteUrl(id: number): Promise<Url | null> {
    const queryText = "DELETE from url WHERE id = $1";
    const values = [id];

    try {
      const { rows } = await this.pool.query(queryText, values);
      return rows[0] || null;
    } catch (err) {
      console.log({ "Error deleting url": err });
      return null;
    }
  }
}

export default UrlModel;
