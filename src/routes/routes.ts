import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { body } from 'express-validator'
import bodyParser from 'body-parser';
import multer, { Multer } from 'multer';
import { UserController } from '../controller/users.controller';
import { MakananController } from '../controller/makanan.controller';
import { MinumanController } from '../controller/minuman.controller';

dotenv.config();


const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'image_user') {
        cb(null, 'storage/user_image');
      } else if (file.fieldname === 'gambar_makanan') {
        cb(null, 'storage/makanan')
      } else if (file.fieldname == 'gambar_minuman') {
        cb(null, 'storage/minuman')
      }
    },
    filename: (req, file, cb) => {
      if (file.fieldname === 'image_user') {
        cb(null, file.fieldname + ' ' + Date.now());
      } else if (file.fieldname === 'gambar_makanan') {
        cb(null, file.fieldname + ' ' + Date.now());
      } else if (file.fieldname === 'gambar_minuman') {
        cb(null, file.fieldname + ' ' + Date.now());
      }
      
    }
  });
  
  let uploadImage = multer({
    storage: imageStorage
  });
  
  let imageUser = uploadImage.fields([
    {
    name: "image_user", maxCount : 1
  }])
  
  let imageMakanan = uploadImage.fields([{
    name: "gambar_makanan", maxCount: 1
  }])
  
  const imageMinuman = uploadImage.fields ([{
    name: "gambar_minuman", maxCount: 1
  }])
  
  
  
  export default function Routes(app: Express) {
    const oauthController = new UserController();
    const makananController = new MakananController();
    const minumanController = new MinumanController();
    const checkToken = new UserController().checkToken
  
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(cors());
  app.use(bodyParser.json());

  app.get("/v1/makanan", makananController.getMakanan)
  app.get("/v1/minuman", minumanController.getMinuman)

  //
  
  app.post("/v1/add-minuman", imageMinuman, minumanController.addMinuman)
  app.post("/v1/signup", imageUser, oauthController.signUp),
  app.post("/v1/signin", oauthController.signIn);
  app.post("/v1/add-makanan", imageMakanan, makananController.addMakanan)
  
  app.get("/", function(req, res) {
    return res.send("testttt")
  })
}