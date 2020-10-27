import { Request } from 'express';
import { Body, Controller, Req, Route } from '../lib';
import { GreetingBody } from './schemas/hello-name.schema';

@Controller({ path: '/decorator' })
export class HelloWorld {
  @Route()
  public hello(@Req() req: Request) {
    console.log(req.ip);
    return 'Hello world';
  }

  @Route({ method: 'post' })
  public greeting(@Body() body: GreetingBody) {
    console.log(body);
    return {
      greeting: 'Hello ' + body.name,
    };
  }
}
