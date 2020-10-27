import { Express } from 'express';

export * from './decorator-example';
import hocExample from './hof-example';

export function registerHofs(app: Express) {
  console.log('registering hofs');
  hocExample(app);
}
