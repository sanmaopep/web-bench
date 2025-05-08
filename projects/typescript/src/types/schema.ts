import { Setter, SetterValueType, ValueSetter, CustomSetterRender } from './setter'

export interface FormSchema<
  T extends { [key: string]: SetterValueType },
  CustomSetterRenderDef extends { [key: string]: CustomSetterRender<any, any> } = {}
> {
  fields: ValueSetter<T, T, CustomSetterRenderDef, keyof CustomSetterRenderDef>
  customSetterRenderDefinitions?: CustomSetterRenderDef
}

export interface EditorRef<
  T extends { [key: string]: SetterValueType } = { [key: string]: SetterValueType }
> {
  setSetterValueByPath<P extends (keyof T)[] | [...(keyof T)[], keyof T[keyof T & any]]>(
    path: P,
    value: P extends [infer First, ...infer Rest]
      ? First extends keyof T
        ? Rest extends []
          ? T[First]
          : Rest extends (string | number | symbol)[]
          ? any
          : never
        : never
      : never
  ): void
}
