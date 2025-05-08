export interface InputSetter {
  type: 'input'
  value: string
}

export interface NumberSetter {
  type: 'number'
  value: number
}

export interface CheckboxSetter {
  type: 'checkbox'
  value: boolean
}

export type Setter = InputSetter | NumberSetter | CheckboxSetter
