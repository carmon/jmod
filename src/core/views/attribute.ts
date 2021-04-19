import { createLabel } from "../../dom.core.js";
import { 
  AttributeType,
  dropdownOptions, 
  getDefaultValue
} from "../values.js";
import { generateAddView } from "./add.js";
import { generateValueView } from "./value.js";

interface AttributeViewProps {
  id: string;
  lineBreak?: boolean;
  value: unknown;
  onAddToArray: (id: string, value: unknown) => void;
  onAddToObject: (id: string, value: unknown) => void;
  onInputChange: (e: Event) => void;
  onInputFocus: (e: Event) => void;
  onRemove: (id: string) => void;
}

export const generateAttributeView = ({
  id,
  lineBreak,
  value,
  onAddToArray,
  onAddToObject,
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
      lineBreak: lineBreak !== undefined ? lineBreak : true,
      value: value as string | boolean | null,
      onChange: onInputChange, 
      onFocus: onInputFocus,
      onRemove: (el) => {
        el.parentElement.removeChild(el);
        onRemove(id);
      }
    });
  }    

  const label = createLabel({ text: key });
  if (Array.isArray(value)) {
    const getRemoveFromArray = (valueId: string, it: number) => (el: HTMLLabelElement) => {
      label.removeChild(el);
      for (let i = it; i < label.children.length - 1; i++) {
        const newId = `${id}-${i}`;
        const childLabel = label.children[i] as HTMLLabelElement;
        childLabel.htmlFor = newId;
        childLabel.firstChild.textContent = i.toString();
        childLabel.firstElementChild.id = newId;
      }
      onRemove(valueId);
    };
    value.forEach((v, it) => {
      const valueId = `${id}-${it}`;
      label.appendChild(
        generateAttributeView({ 
          id: valueId,
          lineBreak: false,
          value: v,
          onAddToArray,
          onAddToObject,
          onInputChange,
          onInputFocus,
          onRemove: (key) => {
            for (let i = it; i < label.children.length - 1; i++) {
              const newId = `${id}-${i}`;
              const childLabel = label.children[i] as HTMLLabelElement;
              childLabel.htmlFor = newId;
              childLabel.firstChild.textContent = i.toString();
              // first element will be <br/>
              childLabel.children[1].id = newId;
            }
            onRemove(key);
          }
        }));
    });

    const addView = generateAddView({
      noKey: true,
      types: dropdownOptions,
      onAdd: (_: string, type: string) => {
        // Array length: label childs len - this view
        const valuesLen = label.children.length - 1;
        const key = valuesLen.toString();
        const newValueId = `${id}-${key}`;
        if (type === 'array') {
          label.appendChild(
            generateAttributeView({ 
              id: newValueId, 
              value: [0],
              onAddToArray,
              onAddToObject,
              onInputChange,
              onInputFocus,
              onRemove
            })
          );
          onAddToArray(id, [0]);
        } 
        else if (type === 'object') {
          label.appendChild(
            generateAttributeView({ 
              id: newValueId, 
              value: { 'key': 0 },
              onAddToArray,
              onAddToObject,
              onInputChange,
              onInputFocus,
              onRemove
            })
          );
          onAddToArray(id, { 'key': 0 });
        } else {
          const defaultValue = getDefaultValue(type as AttributeType);
          label.appendChild(
            generateValueView({
              id: newValueId,
              key: `${key}`,
              value: defaultValue,
              onChange: onInputChange,
              onFocus: onInputFocus,
              onRemove: getRemoveFromArray(newValueId, value.length)
            })
          );
          onAddToArray(id, defaultValue);
        }        
        label.appendChild(addView);
      },
    });    
    label.appendChild(addView);
  } 
  else {
    Object.keys(value).forEach(k => {
      label.appendChild(
        generateAttributeView({ 
          id: `${id}-${k}`, 
          value: (<Record<string, unknown>>value)[k],
          onAddToArray,
          onAddToObject,
          onInputChange,
          onInputFocus,
          onRemove
        })
      );
    });

    const addView = generateAddView({
      types: dropdownOptions,
      onAdd: (key: string, type: string) => {
        const newValueId = `${id}-${key}`;
        if (type === 'array') {
          label.appendChild(
            generateAttributeView({ 
              id: newValueId, 
              value: [0],
              onAddToArray,
              onAddToObject,
              onInputChange,
              onInputFocus,
              onRemove
            })
          );
          onAddToObject(newValueId, [0]);
        } 
        else if (type === 'object') {
          const objValue =  { ['key']: 0 };
          label.appendChild(
            generateAttributeView({ 
              id: newValueId,
              value: objValue,
              onAddToArray,
              onAddToObject,
              onInputChange,
              onInputFocus,
              onRemove
            })
          );
          onAddToObject(newValueId, objValue);
        } else {
          const defaultValue = getDefaultValue(type as AttributeType);
          label.appendChild(
            generateValueView({
              id: newValueId,
              key: `${key}`,
              value: defaultValue,
              onChange: onInputChange,
              onFocus: onInputFocus,
              onRemove: (el) => {
                el.parentElement.removeChild(el);
                onRemove(id);
              }
            })
          );
          onAddToObject(newValueId, defaultValue);
        }        
        label.appendChild(addView);
      },
    });    
    label.appendChild(addView);
  }
  return label;
};