import {Router} from "express";
import {getUsers, postLogin, postSignUp} from "../controllers/usersControllers";
import {check} from 'express-validator'

const router = Router();

router.get('/', getUsers);

router.post('/signup', [
  check('name').not().isEmpty(),
  check('email').normalizeEmail().isEmail(),
  check('password').isLength({min: 6})
], postSignUp);
router.post('/login', [
  check('email').normalizeEmail().isEmail(),
  check('password').isLength({min: 6})
] , postLogin);

export default router