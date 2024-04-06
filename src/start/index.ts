"use strict";

import { Config } from "../config";
import express, { Request } from "express";
import { IAppContext } from "../types/app";
import cors from "cors";
import { json } from "body-parser";
import multer from 'multer'
import path from 'path';
import initDb from "../models";
import initServices from "../services";
import log from "../utils/log";
import router from "../routes";
import mongoose from "mongoose";
import User from "../models/user/rider";
import setContext from "../middlewares/context";
import { createServer } from "http";
import Mileage from "../models/mileage";

export const appContext: IAppContext = {};
export let app;


// http server for websockets
export const server = createServer(app)

export default async function start(config: Config) {
  try {
    // setting global context

    // initialize models
    appContext.models = await initDb(config.db)
    appContext.services = await initServices(appContext)
    

    // initialize app
    app = express();
    app.use(express.urlencoded({ extended: true }));

         // cors middleware
        app.use(
          cors<cors.CorsRequest>(),
          json(),
        );

    //server health check
    app.use("/healthcheck", (_, res) => {
      res.status(200).send("All is green!!!");
    });

    //clear database
    app.get('/clearDB',async (_,res) => {
              const db = mongoose.connection.db;

              // Drop the entire database
              await db.dropDatabase();
      res.status(200).send('database cleared successfully')
    })

    app.get('/clearModel', async(_,res) => {
      await Mileage.deleteMany()
      return res.status(200).json({message:'model cleared'})
    })

    //router
    app.use(router)

    // file uploads
    const avatarStorage = multer.diskStorage({
      destination: path.join(__dirname, '..','uploads','avatars'),
      filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
      }
    });
    
    function checkFileType(file, cb) {
      const filetypes = /jpeg|jpg|png/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
    
      if (extname && mimetype) {
        return cb(null, true);
      } else {
        throw new Error('Error: Images only! (jpeg, jpg, png)');
      }
    }

   const uploadAvatar = multer({
      storage: avatarStorage,
      limits: { fileSize: 10000000 }, // Limit file size to 10MB
      fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
      }
    });

    interface FileRequest extends Request {
      user? : {
        _id:string
      },
      file?: {
        path?:string
      }
    }

    app.post('/uploadprofilepicture', uploadAvatar.single('avatar'),setContext, async (req:FileRequest, res) => {
      try {
            const user = await User.findOne({_id:req.user._id})
            await user.updateOne({ $set: { profile: { avatar: req.file.path } } }, { new: true, upsert: true });
            await user.save();
            return res.status(201).send('Avatar uploaded');
      } catch (e) {
        return res.status(500).send(`Error processing request: ${e}`);
      }
    });
    

    app.use(express.static(path.join(__dirname, '..', 'public')));
    app.get('/uploadfile', (req, res) => {
      res.status(200).sendFile(path.join(__dirname, '..', 'public','upload.html'));
    });

    // start app
    app.listen(config.app.port, () => {
      log.info(
        `Server ready at http://localhost:${config.app.port}`
      );
    }); 
  } catch (err) {
    console.error(err);
  }
}