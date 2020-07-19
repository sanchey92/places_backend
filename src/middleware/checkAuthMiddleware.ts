import {Request, Response, NextFunction} from "express";
import HttpError from "../models/HttpError";
import {verify} from "jsonwebtoken";

export interface Req extends Request {
  userData: any
}

export const checkAuth = (req: Req, res: Response, next: NextFunction) => {

  try {
    const token = req.headers!.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('Authentication failed!');
    }

    const decodedToken: any = verify(token, 'secret');
    req.userData = {userId: decodedToken.userId};

    next();

  } catch (err) {
    const error = new HttpError('Invalid token, please try again', 404);
    return next(error);
  }
}