import {Router} from "express";
import {getPlaceById, getPlaceByUserId, postCreatePlace} from "../controllers/placesControllers";

const router = Router()

router.get('/:pid', getPlaceById);
router.get('/user/:uid', getPlaceByUserId);

router.post('/', postCreatePlace);

export default router