import {RequestHandler} from "express";
import {hash, compare} from "bcryptjs";
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
  let existingUser;

  try {
    existingUser = await User.findOne({email: email});
  } catch (e) {
    return next(new HttpError('Signing up failed, please try again later', 432))
  }

  if (existingUser)  next(new HttpError('User exist already, please login instead', 420))
  let hashedPassword;

  try {
    hashedPassword = await hash(password, 12)
  } catch (e) {
    return next(new HttpError('Could not create user, please try again later', 422))
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: []
  })

  try {
    await createdUser.save()
  } catch (e) {
    return next(new HttpError('Signing up failed, please try again later', 425))
  }

  res.status(200).json({user: createdUser.toObject({getters: true})});
}

export const postLogin: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())  next(new HttpError('Invalid data, please try again', 422))

  const {email, password} = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({email: email})
  } catch (e) {
    return next(new HttpError('Logging in failed, please try again later', 422))
  }

  if (!existingUser) {
    return next(new HttpError('User not found, please try again', 422))
  }

  let isValidPassword: boolean = false;

  try {
    isValidPassword = await compare(password, existingUser.password);
  } catch (e) {
    return next(new HttpError('Invalid password, please try again', 500))
  }

  if (!isValidPassword) {
    return next(new HttpError('Invalid password, please try again', 500))
  }

  res.status(200).json({message: 'Logged in', user: existingUser.toObject({getters: true}) })
}