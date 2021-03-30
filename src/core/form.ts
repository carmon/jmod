import {
  createDropdown,
  createForm,
} from '../dom.js';
import { generateAttributeView } from './views/attribute.js';
import { generateAddView } from './views/add.js';
import { getDefaultValue, setProp, AttributeType, deleteProp, getProp } from './object.js';
import { dropdownOptions, getInputType, getValueType } from './values.js';

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
  let jsonObj = JSON.parse(json);
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

  const handleRemoveAttribute = (id: string) => {
    const keys = id.split('-');
    if (keys.length === 1) 
      form.removeChild(form[keys[0]].parentNode);
    
    deleteProp(jsonObj, keys);
    setValue(JSON.stringify(jsonObj, null, 2));
  };

  // Create form with JSON attributes /////////////////////////////////////////////////////
  const keys = Object.keys(jsonObj);
  keys.forEach(k => {
    form.appendChild(
      generateAttributeView({
        id: k, 
        value: jsonObj[k],
        onAddToArray: handleAddToArray,
        onInputChange: (e) => handleInputChange(e.currentTarget as HTMLInputElement),
        onInputFocus: handleInputFocus,
        onRemove: handleRemoveAttribute,
      })
    );
  });
  /////////////////////////////////////////////////////////////////////////////////////////

  const onDropdownChange = (e: Event) => {
    const { value } = e.target as HTMLSelectElement;
    if (!currentInput) return;
    
    if (value === 'boolean') {
      currentInput.checked = false;
      currentInput.onchange = () => handleInputChange(currentInput);
    } else {
      currentInput.value = value === 'string' ? '' : '0';
      currentInput.oninput = () => handleInputChange(currentInput);
    } 
    
    currentInput.type = getInputType(value);

    handleInputChange(currentInput);
    currentInput.focus();
  };

  const handleAddAttribute = (baseKey: string, type: string): void => {
    const isArray = Array.isArray(jsonObj); 
    const key = isArray ? `${baseKey}-${jsonObj.length}` : baseKey;

    if (jsonObj[key] !== undefined) {
      window.alert('Key exists in object!');
      return;
    }

    const defaultValue = getDefaultValue(type as AttributeType);
    if (type === 'array') {
      form.appendChild(
        generateAttributeView({
          id: key, 
          value: [defaultValue],
          onAddToArray: handleAddToArray,
          onInputChange: (e) => handleInputChange(e.currentTarget as HTMLInputElement),
          onInputFocus: handleInputFocus,
          onRemove: handleRemoveAttribute
        })
      );

      jsonObj = isArray ? [...jsonObj, defaultValue] : { ...jsonObj, [key]: [defaultValue] };
    } else {
      form.appendChild(
        generateAttributeView({
          id: key, 
          value: defaultValue,
          onAddToArray: handleAddToArray,
          onInputChange: (e) => handleInputChange(e.currentTarget as HTMLInputElement),
          onInputFocus: handleInputFocus,
          onRemove: handleRemoveAttribute
        })
      );

      jsonObj = isArray ? [...jsonObj, defaultValue] : { ...jsonObj, [key]: defaultValue };
    }

    form.appendChild(addView);

    setValue(JSON.stringify(jsonObj, null, 2));
  };

  const addView = generateAddView({
    types: dropdownOptions,
    onAdd: handleAddAttribute,
  });

  form.appendChild(addView);
  
  const dropdown = createDropdown({
    onChange: onDropdownChange,
    options: dropdownOptions
  });

  return form;
}