import {RequestHandler} from "express";
import HttpError from "../models/HttpError";

export const TEST_DATA = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1'
  }
];

export const getPlaceById: RequestHandler = async (req, res, next) => {
  const placeId = req.params.pid;
  const place = await TEST_DATA.find((el: any) => el.id === placeId);
  if (!place) return next(new HttpError('Could not find a place for the provided id', 404))
  res.json({place})
}

export const getPlaceByUserId: RequestHandler = async (req, res, next) => {
  const userId = req.params.uid;
  const place = await TEST_DATA.find((el: any) => el.creator === userId);
  if (!place) return next(new HttpError('Could not find a place for the provided userId', 404))
  res.json({place})
}
