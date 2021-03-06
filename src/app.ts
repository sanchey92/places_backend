import path from "path";
import express, {Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv';
import HttpError from "./models/HttpError";
import {errorHandler} from "./middleware/errorMiddleware";
import {json} from 'body-parser';
import {connect} from "mongoose";
import {corsMiddleware} from "./middleware/corsMiddleware";

import placesRoutes from './routes/places';
import userRoutes from './routes/users';

dotenv.config()

const app = express()

app.use(json())
app.use('/uploads/', express.static(path.join('uploads')))
app.use(corsMiddleware)

app.use('/api/places', placesRoutes)
app.use('/api/users', userRoutes)

app.use((req: Request, res: Response, next: NextFunction) => {
  next (new HttpError('Could not find this route', 404))
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000;
const MONGODB_KEY = process.env.MONGODB_KEY;
const URL = `mongodb+srv://alexandr:${MONGODB_KEY}@cluster0-neyyj.mongodb.net/places?retryWrites=true&w=majority`

const start = async () => {
  try {
    await connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    app.listen(PORT)
  } catch (e) {
    console.log(e)
  }
}

start().then(() => console.log('server started'))