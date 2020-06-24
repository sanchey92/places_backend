import {ErrorRequestHandler} from "express";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) next(error)
  res.status(error.code || 500)
  res.json({message: error.message || 'An unknown error occurred'})
}
