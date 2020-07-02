import axios from 'axios';
import HttpError from "../models/HttpError";
import {CoordinatesType} from "../models/Place";

export const getCoordsForAddress = async (address: any): Promise<CoordinatesType> => {

  const api_Key = process.env.GOOGLE_API_KEY;

  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${api_Key}`
  );
  const data = response.data;

  if (!data || data.status === 'ZERO RESULTS') throw new HttpError('Could not find for the specified address', 422);

  return data.results[0].geometry.location
}