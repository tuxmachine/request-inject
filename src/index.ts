import 'reflect-metadata';
import './handlers';
import express from 'express';
import { RegisterControllers } from './lib';

const app = express();
const port = 3000;

RegisterControllers(app);

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
