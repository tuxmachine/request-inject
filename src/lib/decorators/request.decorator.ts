export const RequestArgumentKey = Symbol('RequestArgument');

export function Request(): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) =>
    Reflect.defineMetadata(
      RequestArgumentKey,
      { propertyKey, parameterIndex },
      target,
      propertyKey,
    );
}
