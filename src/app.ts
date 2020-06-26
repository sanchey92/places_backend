import express from 'express';
import dotenv from 'dotenv';
import HttpError from "./models/HttpError";
import {errorHandler} from "./middleware/errorMiddleware";
import {json} from 'body-parser';

import placesRoutes from './routes/places';
import userRoutes from './routes/users';

dotenv.config()

const app = express()

app.use(json())

app.use('/api/places', placesRoutes);
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
  throw  new HttpError('Could not find this route', 404)
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on localhost:${PORT}`))