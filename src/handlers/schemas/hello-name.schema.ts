import { Length } from 'class-validator';

export class GreetingBody {
  @Length(1)
  name: string;
}

export class GreetingResponse {
  @Length(1)
  greeting: string;
}
