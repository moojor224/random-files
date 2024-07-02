/** @typedef {(BasicAny | NestedBasicAnyArray)[]} NestedBasicAnyArray */
/** @typedef {string | number | boolean} BasicAny */
/**
 * @template T
 * @typedef {| (T extends infer U ? U : never) | Extract<T, number | string | boolean | bigint | symbol | null | undefined | []> | ([T] extends [[]] ? [] : { [K in keyof T]: Narrow<T[K]> })} Narrow
 */
/**
 * creates a readonly enum from the provided values\
 * type declarations make it so that your IDE will show the original values on hover
 * @template E
 * @type {<E extends Record<string, BasicAny | NestedBasicAnyArray>>(values: Narrow<E>) => E}
 */
export function createENUM(values) {
    return Object.freeze(Object.fromEntries(Object.entries(values).map(([key, value]) => [key, Symbol(value)])));
}
const Colors = createENUM({ RED: "Red", GREEN: "Green", BLUE: "Blue", BOOL: true, ARR: [1, "one", true, [true,[true,[true,[true]]]]] });
console.log(Colors.RED); // Output: Red
