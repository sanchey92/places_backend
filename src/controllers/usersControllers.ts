import {RequestHandler} from "express";
import HttpError from "../models/HttpError";
import {validationResult} from 'express-validator'

const TEST_USER = [
  {
    id: 'u1',
    name: 'Alexandr Ageev',
    email: 'test@gmail.com',
    password: '123456'
  }
]

export const getUsers : RequestHandler = async (req, res) => {
  res.json({users: TEST_USER})
}

export const postSignUp: RequestHandler = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new HttpError('Invalid data, please try again', 422)

  const {name, email, password} = req.body;
  const hasUser = TEST_USER.find((el: any) => el.email === email);

  if (hasUser) throw new HttpError('this email already exists', 401)

  const newUser = {id: Math.random().toString(), name, email, password};
  TEST_USER.push(newUser);

  res.status(200).json({message: 'Signup success'});
}

export const postLogin: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new HttpError('Invalid data, please try again', 422)
  const {email, password} = req.body;

  const identifiedUser = TEST_USER.find ((el: any) => el.email === email );
  if (!identifiedUser) throw new HttpError('Could not identify user', 401);

  res.json({message: 'Logged in'})
}