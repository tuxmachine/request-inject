export const ResponseArgumentKey = Symbol('ResponseArgument');

export function Res(): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) =>
    Reflect.defineMetadata(ResponseArgumentKey, parameterIndex, target, propertyKey);
}

export function getResponseArgIndex(target: Object, propertyKey: string | symbol) {
  return Reflect.getMetadata(ResponseArgumentKey, target, propertyKey);
}
