export const guard = <TParam, TResult = void>(
    param: TParam | undefined,
    cb: (param: TParam) => TResult,
    defaultValue: TResult | undefined = undefined,
): TResult | undefined => {
    if (!param) {
        return defaultValue;
    }

    return cb(param);
}