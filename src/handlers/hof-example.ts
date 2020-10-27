import { Router, Express } from 'express';
import { requestHandler } from '../lib';
import { GreetingBody, GreetingResponse } from './schemas/hello-name.schema';

const router = Router();

router.get(
  '/hello',
  requestHandler({
    handler: () => 'Hello world',
  }),
);

router.post(
  '/greeting',
  requestHandler({
    validation: {
      body: GreetingBody,
      response: GreetingResponse,
    },
    handler: req => ({
      greeting: 'Hello ' + req.body.name,
    }),
  }),
);

export default (app: Express) => app.use('/hof', router);
