import {RequestHandler} from "express";
import HttpError from "../models/HttpError";
import {validationResult} from 'express-validator'
import {getCoordsForAddress} from "../utils/googleLocation";

export let TEST_DATA = [
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

export const postCreatePlace: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw new HttpError('Invalid input passed, please check your date', 422)

  const {title, description, address, creator} = req.body;

  let coordinates;

  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return  next(error)
  }

  const createdPlace = {
    id: Math.random().toString(),
    title,
    description,
    location: coordinates,
    address,
    creator
  }
  TEST_DATA.push(createdPlace)

  res.json({createdPlace})
}

export const patchUpdatePlace: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new HttpError('Invalid input passed, please check your date', 422)

  const placeId = req.params.pid;
  const {title, description} = req.body;

  const updatedPlace: any = {...await TEST_DATA.find((el: any) => el.id === placeId)};
  const placeIndex = await TEST_DATA.findIndex((el: any) => el.id === placeId);

  updatedPlace.title = title;
  updatedPlace.description = description;

  TEST_DATA[placeIndex] = updatedPlace;

  res.status(200).json({place: updatedPlace})

}

export const deletePlace: RequestHandler = async (req, res, next) => {
  const placeId = req.params.pid;
  TEST_DATA = TEST_DATA.filter((el: any) => el.id !== placeId);
  res.status(200).json({message: 'Deleted place'})
}