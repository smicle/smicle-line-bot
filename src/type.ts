/**
 * nullやundefinedが混ざる可能性がある場合の型
 * @param T 任意の型
 */
export type Option<T> = T | null | undefined
