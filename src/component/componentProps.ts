import { Data } from './component';

export type ComponentPropsOptions<P = Data> = {
  [K in keyof P]: Prop<P[K], true | false> | null;
};

type Prop<T, Required extends boolean> = PropOptions<T, Required> | PropType<T>;

export interface PropOptions<T = any, Required extends boolean = false> {
  type?: PropType<T> | null;
  required?: Required;
  default?: T | null | undefined | (() => T | null | undefined);
  validator?(value: any): boolean;
}

export type PropType<T> = PropConstructor<T> | PropConstructor<T>[];

type PropConstructor<T> = { new (...args: any[]): T & object } | { (): T };

type RequiredKeys<T, MakeDefaultRequired> = {
  [K in keyof T]: T[K] extends
    | { required: true }
    | (MakeDefaultRequired extends true ? { default: any } : never)
    ? K
    : never;
}[keyof T];

type OptionalKeys<T, MakeDefaultRequired> = Exclude<keyof T, RequiredKeys<T, MakeDefaultRequired>>;

// prettier-ignore
type InferPropType<T> = T extends null
  ? any // null & true would fail to infer
  : T extends { type: null }
    ? any // somehow `ObjectConstructor` when inferred from { (): T } becomes `any`
    : T extends ObjectConstructor | { type: ObjectConstructor }
      ? { [key: string]: any }
      : T extends Prop<infer V, true | false>
        ? V
        : T;

// prettier-ignore
export type ExtractPropTypes<O, MakeDefaultRequired extends boolean = true> = {
  readonly [K in RequiredKeys<O, MakeDefaultRequired>]: InferPropType<O[K]>;
} & {
  readonly [K in OptionalKeys<O, MakeDefaultRequired>]?: InferPropType<O[K]>;
};
