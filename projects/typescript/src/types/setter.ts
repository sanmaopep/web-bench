import { FC } from 'react'

export type SetterValueType =
  | string
  | number
  | boolean
  | SetterValueType[]
  | { [key: string]: SetterValueType }

export interface BaseSetter<
  ValueType extends SetterValueType,
  FormValue extends { [key: string]: SetterValueType } = { [key: string]: SetterValueType },
  CtxValue extends SetterValueType = FormValue
> {
  value: SetterMaybeExpression<ValueType, FormValue, ValueType, CtxValue>
  onChange: (value: ValueType | undefined) => void
  visible?: SetterMaybeExpression<ValueType, FormValue, boolean, CtxValue>
}

export type OptionalBaseSetter<
  ValueType extends SetterValueType,
  FormValue extends { [key: string]: SetterValueType } = { [key: string]: SetterValueType },
  CtxValue extends SetterValueType = FormValue
> = Partial<BaseSetter<ValueType, FormValue, CtxValue>>

export interface ExpressionEvent<
  SetterValue extends SetterValueType,
  FormulaValue extends { [key: string]: SetterValueType },
  CtxValue extends SetterValueType = FormulaValue
> {
  value: SetterValue
  formValue: FormulaValue
  ctxValue: CtxValue
}

export interface Expression<
  SetterValue extends SetterValueType,
  FormulaValue extends { [key: string]: SetterValueType },
  ExpressionValue,
  CtxValue extends SetterValueType = FormulaValue
> {
  type: 'expression'
  value: (ctx: ExpressionEvent<SetterValue, FormulaValue, CtxValue>) => ExpressionValue
}

export type SetterMaybeExpression<
  SetterValue extends SetterValueType,
  FormulaValue extends { [key: string]: SetterValueType },
  ExpressionValue,
  CtxValue extends SetterValueType = FormulaValue
> = Expression<SetterValue, FormulaValue, ExpressionValue, CtxValue> | ExpressionValue

export interface InputSetter<
  FormValue extends { [key: string]: SetterValueType } = { [key: string]: SetterValueType },
  CtxValue extends SetterValueType = FormValue
> extends OptionalBaseSetter<string, FormValue, CtxValue> {
  type: 'input'
}

export interface NumberSetter<
  FormValue extends { [key: string]: SetterValueType } = { [key: string]: SetterValueType },
  CtxValue extends SetterValueType = FormValue
> extends OptionalBaseSetter<number, FormValue, CtxValue> {
  type: 'number'
}

export interface CheckboxSetter<
  FormValue extends { [key: string]: SetterValueType } = { [key: string]: SetterValueType },
  CtxValue extends SetterValueType = FormValue
> extends OptionalBaseSetter<boolean, FormValue, CtxValue> {
  type: 'checkbox'
}

export interface PasswordSetter<
  FormValue extends { [key: string]: SetterValueType } = { [key: string]: SetterValueType },
  CtxValue extends SetterValueType = FormValue
> extends OptionalBaseSetter<string, FormValue, CtxValue> {
  type: 'password'
}

export interface SelectSetter<
  FormValue extends { [key: string]: SetterValueType } = { [key: string]: SetterValueType },
  CtxValue extends SetterValueType = FormValue
> extends OptionalBaseSetter<string | number, FormValue, CtxValue> {
  type: 'select'
}

export interface ArraySetter<
  Value extends SetterValueType[],
  FormValue extends { [key: string]: SetterValueType } = { [key: string]: SetterValueType },
  CustomSetterRenderDef extends { [key: string]: CustomSetterRender<any, any> } = {},
  CustomType extends keyof CustomSetterRenderDef = string,
  CtxValue extends SetterValueType = FormValue
> extends OptionalBaseSetter<Value, FormValue, CtxValue> {
  type: 'array'
  item: ValueSetter<Value[number], FormValue, CustomSetterRenderDef, CustomType, Value[number]>
}

export interface ObjectSetter<
  Value extends { [key: string]: SetterValueType },
  FormValue extends { [key: string]: SetterValueType } = { [key: string]: SetterValueType },
  CustomSetterRenderDef extends { [key: string]: CustomSetterRender<any, any> } = {},
  CustomType extends keyof CustomSetterRenderDef = keyof CustomSetterRenderDef,
  CtxValue extends SetterValueType = FormValue
> extends OptionalBaseSetter<Value, FormValue, CtxValue> {
  type: 'object'
  properties: {
    [K in keyof Value]: ValueSetter<
      Value[K],
      FormValue,
      CustomSetterRenderDef,
      CustomType,
      CtxValue
    >
  }
}
type NoHyphen<S extends string | number | symbol> = S extends `${infer Head}-${infer Tail}`
  ? never
  : S

export interface CustomSetter<
  ValueType extends SetterValueType,
  FormValue extends { [key: string]: SetterValueType } = { [key: string]: SetterValueType },
  CustomSetterRenderDef extends { [key: string]: CustomSetterRender<any, any> } = {},
  CustomType extends keyof CustomSetterRenderDef = string,
  CtxValue extends SetterValueType = FormValue
> extends OptionalBaseSetter<ValueType, FormValue, CtxValue> {
  type: 'custom'
  customType: CustomType extends NoHyphen<CustomType> ? CustomType : never
  props?: Omit<Parameters<CustomSetterRenderDef[CustomType]['render']>[0], 'value' | 'onChange'>
}

type ToValueSetterTuple<
  T extends SetterValueType[],
  FormValue extends { [key: string]: SetterValueType } = { [key: string]: SetterValueType },
  CustomSetterRenderDef extends { [key: string]: CustomSetterRender<any, any> } = {},
  CustomType extends keyof CustomSetterRenderDef = string,
  CtxValue extends SetterValueType = FormValue
> = {
  [K in keyof T]: ValueSetter<T[K], FormValue, CustomSetterRenderDef, CustomType, CtxValue>
}

export interface TupleSetter<
  Value extends SetterValueType[],
  FormValue extends { [key: string]: SetterValueType } = { [key: string]: SetterValueType },
  CustomSetterRenderDef extends { [key: string]: CustomSetterRender<any, any> } = {},
  CustomType extends keyof CustomSetterRenderDef = keyof CustomSetterRenderDef,
  CtxValue extends SetterValueType = FormValue
> extends OptionalBaseSetter<Value, FormValue, CtxValue> {
  type: 'tuple'
  items: ToValueSetterTuple<Value, FormValue, CustomSetterRenderDef, CustomType, CtxValue>
}

export type Setter<
  ValueType extends SetterValueType = SetterValueType,
  FormValue extends { [key: string]: SetterValueType } = { [key: string]: SetterValueType },
  CustomSetterRenderDef extends { [key: string]: CustomSetterRender<any, any> } = {},
  CustomType extends keyof CustomSetterRenderDef = string,
  CtxValue extends SetterValueType = FormValue
> =
  | InputSetter<FormValue, CtxValue>
  | NumberSetter<FormValue, CtxValue>
  | CheckboxSetter<FormValue, CtxValue>
  | PasswordSetter<FormValue, CtxValue>
  | SelectSetter<FormValue, CtxValue>
  | ArraySetter<
      ValueType extends SetterValueType[] ? ValueType : never,
      FormValue,
      CustomSetterRenderDef,
      CustomType,
      CtxValue
    >
  | TupleSetter<
      ValueType extends SetterValueType[] ? ValueType : never,
      FormValue,
      CustomSetterRenderDef,
      CustomType,
      CtxValue
    >
  | ObjectSetter<
      ValueType extends { [key: string]: SetterValueType } ? ValueType : never,
      FormValue,
      CustomSetterRenderDef,
      CustomType,
      CtxValue
    >
  | CustomSetter<ValueType, FormValue, CustomSetterRenderDef, CustomType, CtxValue>

export type CustomSetterRender<ValueType extends SetterValueType, Props> = {
  render: FC<Props & { value: ValueType; onChange: (value: ValueType) => void }>
}

export type ValueSetter<
  ValueType extends SetterValueType,
  FormValue extends { [key: string]: SetterValueType } = { [key: string]: SetterValueType },
  CustomSetterRenderDef extends { [key: string]: CustomSetterRender<any, any> } = {},
  CustomType extends keyof CustomSetterRenderDef = string,
  CtxValue extends SetterValueType = FormValue
> = ValueType extends string
  ?
      | InputSetter<FormValue, CtxValue>
      | PasswordSetter<FormValue, CtxValue>
      | SelectSetter<FormValue, CtxValue>
      | CustomSetter<ValueType, FormValue, CustomSetterRenderDef, CustomType, CtxValue>
  : ValueType extends number
  ?
      | NumberSetter<FormValue, CtxValue>
      | SelectSetter<FormValue, CtxValue>
      | CustomSetter<ValueType, FormValue, CustomSetterRenderDef, CustomType, CtxValue>
  : ValueType extends boolean
  ?
      | CheckboxSetter<FormValue, CtxValue>
      | CustomSetter<ValueType, FormValue, CustomSetterRenderDef, CustomType, CtxValue>
  : ValueType extends SetterValueType[]
  ?
      | ArraySetter<ValueType, FormValue, CustomSetterRenderDef, CustomType, CtxValue>
      | TupleSetter<ValueType, FormValue, CustomSetterRenderDef, CustomType, CtxValue>
      | CustomSetter<ValueType, FormValue, CustomSetterRenderDef, CustomType, CtxValue>
  : ValueType extends { [key: string]: SetterValueType }
  ?
      | ObjectSetter<ValueType, FormValue, CustomSetterRenderDef, CustomType, CtxValue>
      | CustomSetter<ValueType, FormValue, CustomSetterRenderDef, CustomType, CtxValue>
  : CustomSetter<ValueType, FormValue, CustomSetterRenderDef, CustomType, CtxValue>
