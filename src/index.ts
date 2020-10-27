import 'reflect-metadata';
import './handlers';
import express from 'express';
import { registerControllers } from './lib';
import bodyParser from 'body-parser';
import { registerHofs } from './handlers';

const app = express();
app.use(bodyParser.json());
const port = 3000;

registerControllers(app);
registerHofs(app);

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
