/**
 * An object whose all properties have the same type, where each key is a string.
 */
export interface Dictionary<T = any> {
    [key: string]: T;
}
/**
 * Returns the keys of T.
 */
export declare type KeyOf<T> = {
    [K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends {
    [_ in keyof T]: infer U;
} ? U : never;
/**
 * Returns the type of a Dictionary or array values.
 */
export declare type ValueOf<T> = T extends (infer U)[] ? U : T[keyof T];
