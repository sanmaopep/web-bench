import { Setter, InputSetter } from './setter';

export function isInputSetter(setter: Setter): setter is InputSetter {
    return setter.type === 'input';
}