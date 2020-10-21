import { Request, Response, Router } from 'express';
import { BadRequestException } from '../errors/bad-request.error';
import { getBodyArgIndex, validateBody } from './body.decorator';
import { getRequestArgIndex } from './request.decorator';
import { getResponseArgIndex } from './response.decorator';

export const RouteKey = Symbol('Route');

export interface RouteConfig {
  method?: 'post' | 'get' | 'put' | 'delete';
  path?: string;
}

export function Route(config: RouteConfig = {}): MethodDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const metadataValue = {
      path: `/${propertyKey as string}`,
      method: 'get',
      contentType: 'application/json',
      ...config,
    };
    return Reflect.defineMetadata(RouteKey, metadataValue, target, propertyKey);
  };
}

export function RegisterRoutes(router: Router, Controller: any) {
  const ctrl = new Controller();
  const methods = Object.getOwnPropertyNames(Controller.prototype);
  for (const method of methods) {
    const metadata: Required<RouteConfig> = Reflect.getMetadata(
      RouteKey,
      Controller.prototype,
      method,
    );
    if (!metadata) continue;
    console.log(`Registering [${metadata.method}]: ${metadata.path}`);
    switch (metadata.method) {
      case 'get':
        router.get(metadata.path, RouteHandler(ctrl, method));
        break;
      case 'post':
        router.post(metadata.path, RouteHandler(ctrl, method));
        break;
      case 'put':
        router.put(metadata.path, RouteHandler(ctrl, method));
        break;
      case 'delete':
        router.delete(metadata.path, RouteHandler(ctrl, method));
        break;
    }
  }
}

function RouteHandler(ctrl: any, method: string) {
  return async (req: Request, res: Response) => {
    const handler = ctrl[method];
    const ctor = ctrl.constructor;
    try {
      const args = await getHandlerArguments(ctor, method, req, res);
      const ownsResponse = getRequestArgIndex(ctor.prototype, method);
      const value = await handler(...args);
      if (!ownsResponse) {
        res.json(value);
      }
    } catch (error) {
      res.status(error.status || 500).json({
        error: error.name || 'INTERNAL_SERVER_ERROR',
        exception: {
          message: error.message,
          stack: error.stack,
        },
      });
    }
  };
}

async function getHandlerArguments(target: any, propertyKey: string, req: Request, res: Response) {
  const argLength = target.prototype[propertyKey].length;
  const args = new Array(argLength);
  const reqIndex = getRequestArgIndex(target.prototype, propertyKey);
  if (reqIndex >= 0) {
    args[reqIndex] = req;
  }
  const resIndex = getResponseArgIndex(target.prototype, propertyKey);
  if (resIndex >= 0) {
    args[resIndex] = res;
  }
  const bodyIndex = getBodyArgIndex(target.prototype, propertyKey);
  if (bodyIndex >= 0) {
    try {
      await validateBody(target.prototype, propertyKey, req.body);
    } catch (errors) {
      throw new BadRequestException(errors.join(','));
    }
    args[bodyIndex] = req.body;
  }
  return args;
}
