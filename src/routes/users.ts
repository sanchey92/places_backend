import {Router} from "express";
import {getUsers, postLogin, postSignUp} from "../controllers/usersControllers";

const router = Router();

router.get('/', getUsers);

router.post('/signup', postSignUp);
router.post('/login', postLogin);

export default router