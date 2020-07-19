import {Router} from "express";
import {
  deletePlace,
  getPlaceById,
  getPlaceByUserId,
  patchUpdatePlace,
  postCreatePlace
} from "../controllers/placesControllers";
import {check} from 'express-validator'
import {fileUpload} from "../middleware/fileUploadMiddleware";
import {checkAuth} from "../middleware/checkAuthMiddleware";

const router = Router()

router.get('/:pid', getPlaceById);
router.get('/user/:uid', getPlaceByUserId);

// @ts-ignore
router.use(checkAuth);

router.post('/',
  fileUpload.single('image'),
  [
  check('title').not().isEmpty(),
  check('description').isLength({min: 5}),
  check('address').not().isEmpty()
  ], postCreatePlace);

router.patch('/:pid', [
  check('title').not().isEmpty(),
  check('description').isLength({min: 5})
], patchUpdatePlace);

router.delete('/:pid', deletePlace)

export default router