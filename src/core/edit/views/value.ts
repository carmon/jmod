import { createButton, createInput, createLabel, createLineBreak } from "../../../dom.core.js";
import { getInputType } from "../../values.js";

export type FormValue = string | boolean | null | number;
interface ValueViewProps {
  id?: string;
  key?: string;
  lineBreak?: boolean;
  value: FormValue;
  onChange?: (e: Event) => void;
  onFocus?: (e: Event) => void;
  onRemove: (view: HTMLLabelElement) => void;
}

export const generateValueView = ({ 
  id, 
  key,
  lineBreak,
  value, 
  onChange, 
  onFocus,
  onRemove
}: ValueViewProps): HTMLLabelElement => {
  const isNull = value === null; 
  const type = isNull ? 'string' : typeof value;
  const label = createLabel({ htmlFor: id, text: key || id });
  if (lineBreak) 
    label.appendChild(createLineBreak());
  
  label.appendChild(
    createInput({
      disabled: isNull,
      id, 
      onChange: isNull ? undefined : onChange,
      onFocus,
      type: getInputType(type), 
      value: isNull ? 'Value is null' : value as string | boolean,
    })
  );
  label.appendChild(
    createButton({
      onclick: () => {
        onRemove(label);
      },
      text: 'X'
    })
  );
  return label;
};