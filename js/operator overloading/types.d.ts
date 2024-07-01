// declare type ENUM<KEYS> = {
//     [K in keyof KEYS]: KEYS[K];
// }
// declare const createEnum: <KEYS extends Record<string, any>>(values: KEYS) => ENUM<KEYS>

// type Narrow<T> = (T extends infer U ? U : never) | Extract<T, number | string | boolean | bigint | symbol | null | undefined | []> | ([T] extends [[]] ? [] : { [K in keyof T]: Narrow<T[K]> })
declare function createEnum<E extends Record<string, string | number | object | null | undefined | boolean>>(error: Narrow<E>): E;