import {Response, NextFunction} from "express";
import {unlink} from 'fs';
import {RequestHandler} from "express";
import HttpError from "../models/HttpError";
import {validationResult} from 'express-validator'
import {getCoordsForAddress} from "../utils/googleLocation";
import {ClientSession, startSession} from "mongoose";
import Place, {CoordinatesType, IPlaceSchema} from '../models/Place';
import User, {IUser} from "../models/User";
import {Req} from "../middleware/checkAuthMiddleware";

export const getPlaceById: RequestHandler = async (req, res, next) => {
  const placeId = req.params.pid;
  let place: IPlaceSchema | null;

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
  let userWithPlaces;

  try {
    userWithPlaces = await User.findById(userId).populate('places')
  } catch (e) {
    return next(new HttpError('Something went wrong, could not find a place', 500))
  }
  // @ts-ignore
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(new HttpError('Could not find a place for the provided userId', 404))
  }
  // @ts-ignore
  res.json({places: userWithPlaces.places.map(place => place.toObject({getters: true}))});
}

export const postCreatePlace: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) next(new HttpError('Invalid input passed, please check your date', 422))

  const {title, description, address, creator} = req.body;
  let coordinates: CoordinatesType | null;

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
    image: req.file.path,
    creator
  })

  let user: IUser | null;

  try {
    user = await User.findById(creator)
  } catch (e) {
    return next(new HttpError('Creating place failed, please try again', 500))
  }

  if (!user) next(new HttpError('User not found, please try again!', 500))

  try {
    const sess: ClientSession = await startSession();
    sess.startTransaction();
    await createdPlace.save({session: sess})
    user!.places.push(createdPlace)
    await user!.save({session: sess})
    await sess.commitTransaction()
  } catch (error) {
    const err = new HttpError('Creating place failed, try again!', 500);
    return next(err)
  }

  res.json({createdPlace})
}

export const patchUpdatePlace = async (req: Req, res: Response, next: NextFunction) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) next(new HttpError('Invalid input passed, please check your date', 422))

  const placeId = req.params.pid;
  const {title, description} = req.body;
  let place: IPlaceSchema | null;

  try {
    place = await Place.findById(placeId);
  } catch (e) {
    return next(new HttpError('Something went wrong, try again later', 401))
  }

  if (place!.creator.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to edit this place!', 401);
    return next(error)
  }

  place!.title = title;
  place!.description = description;

  try {
    await place!.save()
  } catch (e) {
    return next(new HttpError('Something went wrong, try again later', 422))
  }

  res.status(200).json({place: place!.toObject({getters: true})})

}

export const deletePlace = async (req: Req, res: Response, next: NextFunction) => {
  const placeId = req.params.pid;

  let place: IPlaceSchema | null;

  try {
   place = await Place.findById(placeId).populate('creator')
  } catch (e) {
    return next(new HttpError('Something went wrong, please try again later', 422))
  }

  if (!place) next(new HttpError('Place not found, please try again', 404));

  if (place!.creator.id !== req.userData.userId) {
    const error =  new HttpError('You are not allowed to delete this place', 401);
    return next(error)
  }

  const imagePath = place!.image;

  try {
    const sess: ClientSession = await startSession()
    sess.startTransaction()
    // @ts-ignore
    await place!.remove({session: sess})
    place!.creator.places.pull(place)
    await place!.creator.save({session: sess})
    await sess.commitTransaction()
  } catch (e) {
    return next(new HttpError('Something went wrong, please try again later', 404))
  }

  unlink(imagePath, (err) => {
    console.log(err);
  })

  res.status(200).json({message: 'Deleted place'})
}