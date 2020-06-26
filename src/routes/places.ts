import {Router} from "express";
import {
  deletePlace,
  getPlaceById,
  getPlaceByUserId,
  patchUpdatePlace,
  postCreatePlace
} from "../controllers/placesControllers";

const router = Router()

router.get('/:pid', getPlaceById);
router.get('/user/:uid', getPlaceByUserId);

router.post('/', postCreatePlace);

router.patch('/:pid', patchUpdatePlace);

router.delete('/:pid', deletePlace)

export default router