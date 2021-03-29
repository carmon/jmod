import { createLabel } from "../dom.js";
import { generateInputFrom } from "./input.js";
import { generateTableFrom } from "./table.js";

interface LabelFromProps {
  id: string;
  value: unknown;
  onTableChange: (e: Event) => void;
  onTableClick: (e: Event) => void;
  onInputChange: (e: Event) => void;
  onInputFocus: (e: Event) => void;
}

export const generateLabelFrom = ({
  id, 
  value, 
  onInputChange, 
  onInputFocus, 
  onTableChange, 
  onTableClick 
}: LabelFromProps): HTMLLabelElement => {
  const key = id.includes('-') 
    ? id.split('-')[id.split('-').length - 1]
    : id;
    
  const label = createLabel({ key });
  if (typeof(value) === 'object') {
    if (Array.isArray(value)) {
      label.appendChild(
        generateTableFrom({ 
          id, 
          value,
          onChange: onTableChange, 
          onClick: onTableClick,
          onInputFocus,
        })
      );
    } else if (value === null) {
      label.appendChild(generateInputFrom({ id, value: null }));
    }
    else {
      Object.keys(value).forEach(k => {
        label.append(
          generateLabelFrom({ 
            id: `${id}-${k}`, 
            value: (<Record<string, unknown>>value)[k],
            onInputChange,
            onInputFocus,
            onTableChange,
            onTableClick
          })
        );
      });
    }
  } else {
    label.appendChild(
      generateInputFrom({ 
        id, 
        value: value as string,
        onChange: onInputChange,
        onFocus: onInputFocus
      })
    );
  }
  return label;
};