import { validateOrReject } from 'class-validator';

export const BodyArgumentKey = Symbol('BodyArgument');

export function Body(): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) =>
    Reflect.defineMetadata(BodyArgumentKey, parameterIndex, target, propertyKey);
}

export function getBodyArgIndex(target: Object, propertyKey: string | symbol) {
  return Reflect.getMetadata(BodyArgumentKey, target, propertyKey);
}

export function validateBody(target: Object, propertyKey: string | symbol, body: any) {
  const index = getBodyArgIndex(target, propertyKey);
  const argTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
  const type = argTypes[index];
  const typed = Object.create(type.prototype);
  Object.assign(typed, body);
  return validateOrReject(typed);
}
