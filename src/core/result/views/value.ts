import { createInput, createLabel, createLineBreak } from "../../../dom.core.js";
import { getInputType } from "../../values.js";

export type FormValue = string | boolean | null | number;
interface ValueViewProps {
  id?: string;
  key?: string;
  lineBreak?: boolean;
  value: FormValue | Record<string, FormValue> | FormValue[];
  onChange?: (e: Event) => void;
  onFocus?: (e: Event) => void;
}

export const generateValueView = ({ 
  id, 
  key,
  lineBreak,
  value, 
  onChange, 
  onFocus,
}: ValueViewProps): HTMLLabelElement => {
  const isNull = value === null; 
  const type = isNull ? 'string' : typeof value;
  const label = createLabel({ htmlFor: id, text: key || id });
  if (lineBreak) 
    label.appendChild(createLineBreak());
  
  if (Array.isArray(value)) {
    value.forEach((v, i) => {
      label.appendChild(
        createInput({
          id: `${id}-${i}`, 
          onChange: isNull ? undefined : onChange,
          onFocus,
          type: getInputType(type), 
          value: v as string | boolean,
        })
      )
    })
  } else if (typeof value === 'object' && !isNull) {
    Object.keys(value).forEach(k => {
      label.appendChild(
        generateValueView({ 
          id: `${id}-${k}`,
          key: k,
          lineBreak: true,
          onChange: isNull ? undefined : onChange,
          onFocus,
          value: value[k],
        })
      );
    })
  } else {
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
  }
  
  return label;
};