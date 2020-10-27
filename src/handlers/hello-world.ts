import { Request } from 'express';
import { Body, Controller, Req, Route } from '../lib';
import { GreetingBody, GreetingResponse } from './schemas/hello-name.schema';

@Controller()
export class HelloWorld {
  @Route()
  public hello(@Req() req: Request) {
    console.log(req.ip);
    return 'Hello world';
  }

  @Route({ method: 'post' })
  public async greeting(@Body() body: GreetingBody): Promise<GreetingResponse> {
    console.log(body);
    await 1;
    return {
      greeting: 'Hello ' + body.name,
    };
  }
}
