import {RequestHandler} from "express";
import HttpError from "../models/HttpError";
import User, {IUser} from "../models/User";
import {validationResult} from 'express-validator'

export const getUsers: RequestHandler = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, '-password')
  } catch (e) {
    return next(new HttpError('Users not found, please try again later', 500));
  }

  res.json({users: users.map((el: IUser) => el.toObject({getters: true}))})
}

export const postSignUp: RequestHandler = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) next(new HttpError('Invalid data, please try again', 422))

  const {name, email, password} = req.body;
  let existingUser: IUser | null;

  try {
    existingUser = await User.findOne({email: email});
  } catch (e) {
    return next(new HttpError('Signing up failed, please try again later', 422))
  }

  if (existingUser) return next(new HttpError('User exist already, please login instead', 422))

  const createdUser: IUser = new User({
    name,
    email,
    image: 'https://sun1-17.userapi.com/v7AQeA7kfD5W7K5_cs2qzMl8pC6jmKSLOJTQhg/zlDnrPeDOmQ.jpg',
    password,
    places: []
  })

  try {
    await createdUser.save()
  } catch (e) {
    return next(new HttpError('Signing up failed, please try again later', 422))
  }

  res.status(200).json({user: createdUser.toObject({getters: true})});
}

export const postLogin: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())  next(new HttpError('Invalid data, please try again', 422))

  const {email, password} = req.body;
  let existingUser: IUser | null;

  try {
    existingUser = await User.findOne({email: email})
  } catch (e) {
    return next(new HttpError('Logging in failed, please try again later', 422))
  }

  if (!existingUser || existingUser.password !== password) {
    return next(new HttpError('User not found, please try again', 422))
  }

  res.json({message: 'Logged in'})
}