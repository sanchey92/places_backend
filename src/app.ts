import express from 'express';
import {json} from 'body-parser';
import dotenv from 'dotenv';

import placesRoutes from './routes/places';
import {errorHandler} from "./middleware/errorMiddleware";

dotenv.config()
const app = express()
app.use(json())

app.use('/api/places', placesRoutes);

app.use(errorHandler)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on localhost:${PORT}`))