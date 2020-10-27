export const BodyArgumentKey = Symbol('BodyArgument');

export function Body(): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) =>
    Reflect.defineMetadata(BodyArgumentKey, parameterIndex, target, propertyKey);
}

export function getBodyArgIndex(target: Object, propertyKey: string | symbol) {
  return Reflect.getMetadata(BodyArgumentKey, target, propertyKey);
}
