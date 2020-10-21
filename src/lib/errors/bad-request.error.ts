export class BadRequestException {
  public message: string;
  public status = 400;
  public name = 'BAD_REQUEST';
  constructor(error: any) {
    this.message = error;
  }
}
