import {ErrorRequestHandler} from "express";
import {unlink} from "fs";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (req.file) {
    unlink(req.file.path, (err) => {
      console.log(err)
    })
  }
  if (res.headersSent) next(error)
  res.status(error.code || 500)
  res.json({message: error.message || 'An unknown error occurred'})
}
