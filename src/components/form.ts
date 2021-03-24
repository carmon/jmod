import {
  createButton,
  createDropdown,
  createForm,
  createInput,
  createLabel,
} from '../dom.js';
import { cloneToDefault, deepMerge, getDefaultValue, AttributeType } from './utils.js';

interface CoreProps {
    formParent: HTMLElement;
    json: string;
    setValue: (value: string) => void;
}

const getValueType = (t: string) =>
  t === 'checkbox' ? 'boolean' : t === 'text' ? 'string' : 'number';

const getInputType = (t: string) => 
  t === 'boolean' ? 'checkbox' : t === 'string' ? 'text' : 'number';

export default ({
  formParent,
  json,
  setValue,
}: CoreProps): HTMLFormElement => {
  let jsonObj = JSON.parse(json);
  const form = createForm();

  const handleInputChange = (input: HTMLInputElement) => {  
    const { id, value, type, checked } = input;
    const targetValue = type === 'checkbox' ? checked : type === 'number' ? Number(value) : value;
    if (id.includes('-')) {
      const keys = id.split('-');
      const parentValue = keys
        .slice(0, keys.length - 1)
        .reduce(
          (prev, curr) => prev[curr],
          jsonObj
        );
  
      let modified = {};  
      if (Array.isArray(parentValue)) {
        const i = Number(keys.pop()); // Remove last key because it's an index
        parentValue.splice(i, 1, targetValue); // Mutate original value
        modified = keys.reduceRight(
          (prev, curr): unknown => ({ [curr]: prev }),
          parentValue
        );
      } else {
        modified = keys.reduceRight(
          (prev, curr): unknown => ({ [curr]: prev }),
          targetValue
        );
      }
      jsonObj = deepMerge(jsonObj, modified);
    } else {
      jsonObj[id] = targetValue;
    }
    setValue(JSON.stringify(jsonObj, null, 2));
  };
  
  const dropdownOptions = ['string', 'number', 'boolean'];
  let currentInput: HTMLInputElement | null = null;
  
  const onInputFocused = (e: Event) => {
    currentInput = e.currentTarget as HTMLInputElement;
    currentInput.parentElement.appendChild(dropdown);
    dropdown.selectedIndex = dropdownOptions.indexOf(getValueType(currentInput.type));
  }

  const addAttributeToForm = (rootKey: string, value: unknown, parent: HTMLElement) => {
    const key = rootKey.includes('-') 
      ? rootKey.split('-')[rootKey.split('-').length - 1]
      : rootKey;
      
    const label = createLabel({ key });
    const addInputToLabel = (value: string | boolean | null, id: string) => {
      const isNull = value === null; 
      const type = isNull ? 'string' : typeof(value);
      const input = createInput({
        id, 
        onChange: isNull ? undefined : (e) => handleInputChange(e.currentTarget as HTMLInputElement),
        onFocus: onInputFocused,
        type: getInputType(type), 
        value: isNull ? 'Value is null' : value,
      });
      label.appendChild(input);
    };
      
    if (typeof(value) === 'object') {
      if (Array.isArray(value)) {
        value.forEach((v: unknown, i: number) => 
          addAttributeToForm(`${rootKey}-${i}`, v, label));
        const btn = createButton({
          onclick: (e) => {
            e.preventDefault();
            const id = `${rootKey}-${value.length}`;
            const last = value[value.length - 1];
            const type = typeof last;
            console.log(last, type);
            if (type === 'object') {
              if (Array.isArray(last)) {
                // TO DO
                return;
              }
              const clone = cloneToDefault(last);
              Object.keys(clone).forEach(k => addAttributeToForm(`${id}-${k}`, (<Record<string, unknown>>clone)[k], label));
              value.push(clone);
            } else {
              const defaultValue = getDefaultValue(type as AttributeType);
              addAttributeToForm(id, defaultValue, label);
              value.push(defaultValue);
            }
            label.appendChild(btn);
    
            setValue(JSON.stringify(jsonObj, null, 2));
          },
          text: 'Add another'
        });
        label.appendChild(btn);
      } else if (value === null)
        addInputToLabel(value as null, rootKey);
      else {
        Object.keys(value)
          .forEach(k => addAttributeToForm(`${rootKey}-${k}`, (<Record<string, unknown>>value)[k], label));
      }
    } else {
      addInputToLabel(value as string, rootKey);
    }
    
    parent.appendChild(label);
  };

  Object.keys(jsonObj)
    .forEach(k => addAttributeToForm(k, jsonObj[k], form));
  formParent.appendChild(form);

  const dropdown = createDropdown({
    onChange: (e) => {
      const { value } = e.target as HTMLSelectElement;
      const input = currentInput;
      
      if (value === 'string') 
        input.oninput = () => handleInputChange(input);
      else 
        input.onchange = () => handleInputChange(input);
      
      input.type = getInputType(value);

      if (value === 'boolean') input.checked = false;
      if (value === 'number') input.value = '0';
      if (value === 'string') input.value = '';
      if (value === 'array') {
        // TO DO
      }

      handleInputChange(input);
      input.focus();
    },
    options: dropdownOptions
  });

  return form;
}