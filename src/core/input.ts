import { createInput } from "../dom.js";
import { getInputType } from "./values.js";

interface InputFromProps {
  value: string | boolean | null,
  id: string,
  onChange?: (e: Event) => void;
  onFocus?: (e: Event) => void;
}

export const generateInputFrom = ({ id, value, onChange, onFocus}: InputFromProps): HTMLInputElement => {
  const isNull = value === null; 
  const type = isNull ? 'string' : typeof value;
  const input = createInput({
    disabled: isNull,
    id, 
    onChange: isNull ? undefined : onChange,
    onFocus,
    type: getInputType(type), 
    value: isNull ? 'Value is null' : value as string | boolean,
  });
  return input;
};