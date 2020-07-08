import multer from 'multer';

export const fileUpload = multer({
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, 'uploads/')
    },
    filename: (req: any, file: any, cb: any) => {
      cb(null, file.originalname)
    }
  }),
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png") {

      cb(null, true);
    } else {
      cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
    }
  }
})
