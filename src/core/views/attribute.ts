import { createLabel } from "../../dom.js";
import { generateValueView } from "./value.js";

interface AttributeViewProps {
  id: string;
  value: unknown;
  onInputChange: (e: Event) => void;
  onInputFocus: (e: Event) => void;
  onRemove: (id: string) => void;
}

export const generateAttributeView = ({
  id, 
  value, 
  onInputChange, 
  onInputFocus,
  onRemove,
}: AttributeViewProps): HTMLLabelElement => {
  const key = id.includes('-') 
    ? id.split('-')[id.split('-').length - 1]
    : id;

  const type = typeof value;
  if (value === null || type !== 'object') {
    return generateValueView({
      id,
      key, 
      value: value as string | boolean | null,
      onChange: onInputChange, 
      onFocus: onInputFocus,
      onRemove: () => {
        onRemove(id)
      }
    });
  }    
  
  const label = createLabel({ text: key });
  if (Array.isArray(value)) {
    value.forEach((v, it) => {
      const valueId = `${id}-${it}`;
      label.appendChild(
        generateValueView({
          id: valueId,
          key: `${it}`,
          value: v as string | boolean | null,
          onChange: onInputChange,
          onFocus: onInputFocus,
          onRemove: (el) => {
            label.removeChild(el);
            onRemove(valueId);
          }
        })
      );
    });
  } 
  else {
    Object.keys(value).forEach(k => {
      label.appendChild(
        generateAttributeView({ 
          id: `${id}-${k}`, 
          value: (<Record<string, unknown>>value)[k],
          onInputChange,
          onInputFocus,
          onRemove
        })
      );
    });
  }
  return label;
};