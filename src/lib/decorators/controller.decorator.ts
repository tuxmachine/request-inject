import { Application, Router } from 'express';
import { RegisterRoutes } from './route.decorator';

export const ControllerKey = Symbol('Controller');

export interface ControllerConfig {
  path?: string;
}

type Constructor = new () => Object;
export const ControllerSet = new Set<Constructor>();

export function Controller(config: ControllerConfig = {}): ClassDecorator {
  const metadataValue = {
    path: '/',
    ...config,
  };
  return (target: Object) => {
    ControllerSet.add(target as Constructor);
    return Reflect.defineMetadata(ControllerKey, metadataValue, target);
  };
}

export function registerControllers(app: Application) {
  for (const Controller of ControllerSet) {
    const metadata: Required<ControllerConfig> = Reflect.getMetadata(ControllerKey, Controller);
    console.log('Registering controller: ' + metadata.path);
    const router = Router();
    RegisterRoutes(router, Controller);
    app.use(metadata.path, router);
  }
}
