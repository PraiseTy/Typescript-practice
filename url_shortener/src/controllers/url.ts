import { Request, Response } from "express";
import UrlModel, { Url } from "../models/schema";
// import { customAlphabet } from "nanoid";
import pool from "../db/connect";

let nanoidModule: any;
import("nanoid")
  .then((module) => {
    nanoidModule = module.default;
  })
  .catch((err) => {
    console.log("Error importing nanoid:", err);
  });

const urlModel = new UrlModel(pool);

const createShortUrl = async (req: Request, res: Response) => {
  try {
    const { original_url, shortened_url } = req.body;
    const generateShortId = nanoidModule?.customAlphabet(
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
      6
    );

    if (!original_url) {
      return res.status(400).json({ error: "Original Url required" });
    }

    const shortId = generateShortId();
    const shortenedUrl = `https://example.com/${shortId}`;

    const url = await urlModel.createUrl({
      original_url,
      shortened_url: shortenedUrl,
    });
    return res.status(200).json({
      message: "Url Shortened sucessfully",
      data: original_url,
      shortened_url: shortenedUrl,
    });
  } catch (error) {
    console.error({ "Error creating short url:": error });
    res.status(500).json({ error: "Something went wrong. Try again" });
  }
};

const getAllUrls = async (req: Request, res: Response) => {
  try {
    const urls = await urlModel.findAll();
    return res.status(200).json({ message: "Returning all urls", data: urls });
  } catch (err) {
    return res.status(500).json({ "Something went wrong": err });
  }
};

const getUrl = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const urlId: number = parseInt(id, 10);

    const urls = await urlModel.findOne(urlId);
    return res.status(200).json({ urls });
  } catch (err) {
    return res.status(500).json({ "Error retrieving single url": err });
  }
};

const deleteUrls = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const urlId: number = parseInt(id, 10);
    const urls = await urlModel.deleteUrl(urlId);
    return res.status(200).json({ message: "Url deleted successfully" });
  } catch (err) {
    return res.status(500).json({ "Error deleting url: ": err });
  }
};
export default { createShortUrl, getAllUrls, getUrl, deleteUrls };
