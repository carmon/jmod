import {
  createDropdown,
  createForm,
} from '../dom.core.js';
import { generateAttributeView } from './views/attribute.js';
import { generateAddView } from './views/add.js';
import { setProp, deleteProp, getProp } from './object.js';
import { 
  AttributeType,
  dropdownOptions, 
  getDefaultValue, 
  getInputType, 
  getValueType 
} from './values.js';

interface CoreProps {
    json: string;
    setValue: (value: string) => void;
}

const getValueFromInput = ({ checked, type, value }: HTMLInputElement) => 
  type === 'checkbox' ? checked : type === 'number' ? Number(value) : value

export default ({
  json,
  setValue,
}: CoreProps): HTMLFormElement => {
  const jsonObj = JSON.parse(json);
  const isArray = Array.isArray(jsonObj); 
  const form = createForm();

  const handleInputChange = (input: HTMLInputElement) => {  
    const { id } = input;
    const targetValue = getValueFromInput(input);
    if (id.includes('-')) 
      setProp(jsonObj, id.split('-'), targetValue);
    else
      setProp(jsonObj, [id], targetValue);
    
    setValue(JSON.stringify(jsonObj, null, 2));
  };

  let currentInput: HTMLInputElement | null = null;  
  const handleInputFocus = (e: Event) => {
    currentInput = e.currentTarget as HTMLInputElement;
    if (currentInput && currentInput.parentElement) {
      currentInput.parentElement.insertBefore(dropdown, currentInput.nextElementSibling);
      dropdown.selectedIndex = dropdownOptions.indexOf(getValueType(currentInput.type));
    }
  }

  const handleAddToArray = (id: string, value: unknown) => {
    const keys = id.split('-');
    const array = getProp(jsonObj, keys) as unknown[];
    setProp(jsonObj, keys, [...array, value]);
    setValue(JSON.stringify(jsonObj, null, 2));
  };

  const handleAddToObject = (id: string, value: unknown) => {
    const keys = id.split('-');
    if (getProp(jsonObj, keys)) {
      window.alert('Key exists in object!');
      return;
    }
    setProp(jsonObj, keys, value);
    setValue(JSON.stringify(jsonObj, null, 2));
  }

  const handleRemoveAttribute = (id: string) => {
    const keys = id.split('-');

    if (isArray) {
      if (keys.length > 1) {
        const [first, ...rest] = keys;
        deleteProp(jsonObj[first], rest);
      }
      else {
        deleteProp(jsonObj, keys);
      } 
    } else {
      deleteProp(jsonObj, keys);
    }
    setValue(JSON.stringify(jsonObj, null, 2));    
  };

  // Create form with JSON attributes /////////////////////////////////////////////////////
  const keys = isArray ? jsonObj : Object.keys(jsonObj);
  keys.forEach((k: string, i: number) => {
    form.appendChild(
      generateAttributeView({
        id: isArray ? i.toString() : k, 
        value: isArray ? jsonObj[i] : jsonObj[k],
        onAddToArray: handleAddToArray,
        onAddToObject: handleAddToObject,
        onInputChange: (e) => handleInputChange(e.currentTarget as HTMLInputElement),
        onInputFocus: handleInputFocus,
        onRemove: handleRemoveAttribute,
      })
    );
  });

  const addView = generateAddView({
    types: dropdownOptions,
    onAdd: (baseKey: string, type: string) => {
      const defaultValue = getDefaultValue(type as AttributeType);
      const targetValue = 
        type === 'array' 
          ? [defaultValue] 
          : type === 'object' 
            ? { ['key']: defaultValue }
            : defaultValue;

      handleAddToObject(baseKey, targetValue);
      form.appendChild(
        generateAttributeView({
          id: baseKey, 
          value: targetValue,
          onAddToArray: handleAddToArray,
          onAddToObject: handleAddToObject,
          onInputChange: (e) => handleInputChange(e.currentTarget as HTMLInputElement),
          onInputFocus: handleInputFocus,
          onRemove: handleRemoveAttribute
        })
      );

      form.appendChild(addView);
    },
  });
  form.appendChild(addView);
  /////////////////////////////////////////////////////////////////////////////////////////

  const onDropdownChange = (e: Event) => {
    const { value } = e.target as HTMLSelectElement;
    if (!currentInput) return;
    
    if (value === 'boolean') {
      currentInput.checked = false;
      currentInput.onchange = () => handleInputChange(currentInput);
      currentInput.oninput = null;
    } else {
      currentInput.value = value === 'string' ? '' : '0';
      currentInput.onchange = null;
      currentInput.oninput = () => handleInputChange(currentInput);
    } 
    
    currentInput.type = getInputType(value);

    handleInputChange(currentInput);
    currentInput.focus();
  };

  const dropdown = createDropdown({
    onChange: onDropdownChange,
    options: dropdownOptions
  });

  return form;
}