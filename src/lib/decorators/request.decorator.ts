export const RequestArgumentKey = Symbol('RequestArgument');

export function Req(): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) =>
    Reflect.defineMetadata(RequestArgumentKey, parameterIndex, target, propertyKey);
}

export function getRequestArgIndex(target: Object, propertyKey: string | symbol) {
  return Reflect.getMetadata(RequestArgumentKey, target, propertyKey);
}
