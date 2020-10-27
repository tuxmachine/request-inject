import { validateOrReject } from 'class-validator';
import { Request, Response } from 'express';
import { BadRequestException } from '../errors/bad-request.error';
import { InternalServerError } from '../errors/internal-server.error';

type Constructor = new () => Object;
export interface RequestHandlerConfig<T extends Constructor> {
  contentType?: string;
  handler: (req: Request, res?: Response) => InstanceType<T>;
  validation?: {
    body?: any;
    query?: any;
    params?: any;
    response?: T;
  };
}

export function requestHandler<T extends Constructor>(config: RequestHandlerConfig<T>) {
  return async (req: Request, res: Response) => {
    try {
      if (config.validation) {
        if (config.validation.body) {
          await validate(config.validation.body, req.body, 'Body');
        }
        if (config.validation.query) {
          await validate(config.validation.query, req.query, 'Query');
        }
        if (config.validation.params) {
          await validate(config.validation.params, req.params, 'Params');
        }
      }
      const handlesResponse = config.handler.length > 1;
      const result = await config.handler(req, res);
      if (handlesResponse) {
        return;
      }
      if (config.validation?.response) {
        try {
          await validate(config.validation.response, result, 'Response');
        } catch (e) {
          console.error(e.message);
          throw new InternalServerError('Invalid response');
        }
      }
      res.json(result);
    } catch (err) {
      console.error(err);
      if (!err.status) {
        err = new InternalServerError('Unknown error');
      }
      res.status(err.status);
      res.send(err.message);
    }
  };
}

async function validate(cls: any, data: any, type: string) {
  try {
    const instance = Object.create(cls.prototype);
    Object.assign(instance, data);
    await validateOrReject(instance, {
      forbidUnknownValues: true,
      whitelist: true,
      skipMissingProperties: false,
      forbidNonWhitelisted: true,
    });
  } catch (errors) {
    throw new BadRequestException(type + ': ' + errors.join(', '));
  }
}
