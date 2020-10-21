import 'reflect-metadata';
import './handlers';
import express from 'express';
import { RegisterControllers } from './lib';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
const port = 3000;

RegisterControllers(app);

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
