import { Request, Response, Router } from 'express';

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
    const handler = ctrl[method];
    console.log(`Registering [${metadata.method}]: ${metadata.path}`);
    switch (metadata.method) {
      case 'get':
        router.get(metadata.path, RouteHandler(handler));
        break;
      case 'post':
        router.post(metadata.path, RouteHandler(handler));
        break;
      case 'put':
        router.put(metadata.path, RouteHandler(handler));
        break;
      case 'delete':
        router.delete(metadata.path, RouteHandler(handler));
        break;
    }
  }
}

function RouteHandler(handler: () => any) {
  return async (req: Request, res: Response) => {
    try {
      const value = await handler();
      res.send(value);
    } catch (error) {
      res.status(error.status || 500).json({
        error: 'INTERNAL_SERVER_ERROR',
        exception: {
          message: error.message,
          stack: error.stack,
        },
      });
    }
  };
}
