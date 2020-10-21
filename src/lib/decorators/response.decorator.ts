export const ResponseArgumentKey = Symbol('ResponseArgument');

export function Response(): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) =>
    Reflect.defineMetadata(
      ResponseArgumentKey,
      { propertyKey, parameterIndex },
      target,
      propertyKey,
    );
}
