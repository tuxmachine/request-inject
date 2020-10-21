import { Controller, Route } from '../lib';

@Controller()
export class HelloWorld {
  @Route()
  public hello() {
    return 'Hello world';
  }
}
