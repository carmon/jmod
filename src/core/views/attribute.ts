import { createButton, createLabel } from "../../dom.js";
import { AttributeType, getDefaultValue } from "../object.js";
import { getValueType } from "../values.js";
import { generateValueView } from "./value.js";

interface AttributeViewProps {
  id: string;
  lineBreak?: boolean;
  value: unknown;
  onAddToArray: (id: string, value: unknown) => void;
  onInputChange: (e: Event) => void;
  onInputFocus: (e: Event) => void;
  onRemove: (id: string) => void;
}

export const generateAttributeView = ({
  id,
  lineBreak,
  value,
  onAddToArray,
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

    const addBtn = createButton({
      className: 'add-btn',
      id: `${id}-add`,
      text: 'Add',
      onclick: () => {
        const valuesLen = label.children.length - 1; 
        const key = valuesLen.toString();
        const type = valuesLen 
          ? getValueType((label.children[valuesLen - 1].firstElementChild as HTMLInputElement).type)
          : 'string';
        const newValue = getDefaultValue(type as AttributeType);
        const newValueId = `${id}-${key}`;
        label.appendChild(
          generateValueView({
            id: newValueId,
            key: `${key}`,
            value: newValue,
            onChange: onInputChange,
            onFocus: onInputFocus,
            onRemove: getRemoveFromArray(newValueId, value.length)
          })
        );
        label.appendChild(addBtn);
        onAddToArray(id, newValue);
      }
    });
    
    label.appendChild(addBtn);
  } 
  else {
    Object.keys(value).forEach(k => {
      label.appendChild(
        generateAttributeView({ 
          id: `${id}-${k}`, 
          value: (<Record<string, unknown>>value)[k],
          onAddToArray,
          onInputChange,
          onInputFocus,
          onRemove
        })
      );
    });
  }
  return label;
};