import {RequestHandler} from "express";
import HttpError from "../models/HttpError";
import {validationResult} from 'express-validator'
import {getCoordsForAddress} from "../utils/googleLocation";
import Place, {IPlaceSchema} from '../models/Place';

export const getPlaceById: RequestHandler = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId)
  } catch (e) {
    return next(new HttpError('Something went wrong, cold not find a place', 500))
  }

  if (!place) return next(new HttpError('Could not find a place for the provided id', 404))

  res.json({place: place.toObject({getters: true})})
}

export const getPlaceByUserId: RequestHandler = async (req, res, next) => {
  const userId = req.params.uid;
  let place;

  try {
    place = await Place.find({creator: userId})
  } catch (e) {
    return next(new HttpError('Something went wrong, could not find a place', 500))
  }

  if (!place || place.length === 0) {
    return next(new HttpError('Could not find a place for the provided userId', 404))
  }

  res.json({place: place.map((el: IPlaceSchema) => el.toObject({getters: true}) )});
}

export const postCreatePlace: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new HttpError('Invalid input passed, please check your date', 422)

  const {title, description, address, creator} = req.body;
  let coordinates;

  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error)
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg',
    creator
  })

  try {
    await createdPlace.save()
  } catch (error) {
    const err = new HttpError('Creating place failed, try again!', 500);
    return next(err)
  }

  res.json({createdPlace})
}

export const patchUpdatePlace: RequestHandler = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new HttpError('Invalid input passed, please check your date', 422)

  const placeId = req.params.pid;
  const {title, description} = req.body;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (e) {
    return next(new HttpError('Something went wrong, try again later', 401))
  }

  place!.title = title;
  place!.description = description;

  try {
    await place!.save()
  } catch (e) {
    return  next(new HttpError('Something went wrong, try again later', 422))
  }

  res.status(200).json({place: place!.toObject({getters: true})})

}

export const deletePlace: RequestHandler = async (req, res, next) => {
  const placeId = req.params.pid;

  try {
    await Place.findByIdAndDelete(placeId);
  } catch (e) {
    return next(new HttpError('Something went wrong, please try again later', 422))
  }
  
  res.status(200).json({message: 'Deleted place'})
}