import 'reflect-metadata';
import * as cors from 'cors';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';
import { IRoute, Routes } from './routes';
import { resolveControllerAction } from './controller/utils';

const APP_PORT = process.env.PORT || 3000;

createConnection()
  .then(async connection => {
    // create express app
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach(
      ({ action, controller, route, method, keepOpen = false }: IRoute) => {
        app[method](route, (req: Request, res: Response, next: Function) => {
          // Fetch action
          const controllerAction = resolveControllerAction(controller, action);
          // Promise.resolve in case it's a promise
          Promise.resolve(controllerAction(req, res, next)).then(result => {
            // Send a response if new have one
            if (!keepOpen) {
              result !== null && result !== undefined
                ? res.json(result)
                : res.send();
            }
          });
        });
      }
    );

    // setup express app here
    // ...

    // start express server
    app.listen(APP_PORT);
    console.log(`Express server has started on port ${APP_PORT}`);
  })
  .catch(error => console.log(error));
