import {
  createDropdown,
  createForm,
} from '../dom.js';
import { getDefaultValue, setProp, AttributeType, deleteProp } from './object.js';
import { generateAttributeView } from './views/attribute.js';
import { generateAddView } from './views/add.js';

interface CoreProps {
    json: string;
    setValue: (value: string) => void;
}

const getValueType = (t: string) =>
  t === 'checkbox' ? 'boolean' : t === 'text' ? 'string' : 'number';

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
  
  // const handleTableChange = (e: Event) => {
  //   console.log('handleTableChange');

  //   const isInput = e.target.constructor === HTMLInputElement;
  //   if (!isInput) return;  
    
  //   const input = e.target as HTMLInputElement;
  //   setProp(jsonObj, input.id.split('-'), getValueFromInput(input));
  //   setValue(JSON.stringify(jsonObj, null, 2));
  // };

  // const handleTableClick = (e: Event) => {
  //   e.preventDefault();

  //   const isBtn = e.target.constructor === HTMLButtonElement;
  //   if (!isBtn) return;

  //   const table = e.currentTarget as HTMLTableElement;
  //   const path = table.id.split('-');
    
  //   const value = getProp(jsonObj, path);
  //   if (!Array.isArray(value)) return;

  //   const btnId = (e.target as HTMLButtonElement).id;
  //   const btnKeys = btnId.split('-');

  //   if (btnKeys[btnKeys.length - 1] === 'rem') {
  //     const it = Number(btnKeys[btnKeys.length - 2]);
  //     table.removeChild(table.children[it]);

  //     value.splice(it, 1); // mutates value
      
  //     // setProp(jsonObj, path, value);
  //     setValue(JSON.stringify(jsonObj, null, 2));
  //   }
    
  //   if (btnKeys[btnKeys.length - 1] === 'add') {
  //     const type = typeof value[value.length - 1];
  //     const defaultValue = getDefaultValue(type as AttributeType);
  
  //     const lastRow = table.lastElementChild;
  //     const it = value.length.toString();
  //     table.appendChild(
  //       generateTableRow({
  //         id: `${table.id}-${it}`,
  //         text: it,
  //         value: defaultValue as string,
  //         onInputFocus: handleInputFocus
  //       })
  //     );
  //     table.appendChild(lastRow);
  
  //     setProp(jsonObj, path, [...value, defaultValue]);
  //     setValue(JSON.stringify(jsonObj, null, 2));
  //   }    
  // };

  const dropdownOptions = ['string', 'number', 'boolean'];
  let currentInput: HTMLInputElement | null = null;
  
  const handleInputFocus = (e: Event) => {
    currentInput = e.currentTarget as HTMLInputElement;
    if (currentInput && currentInput.parentElement) {
      currentInput.parentElement.insertBefore(dropdown, currentInput.nextElementSibling);
      dropdown.selectedIndex = dropdownOptions.indexOf(getValueType(currentInput.type));
    }
  }

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
        onInputChange: (e) => handleInputChange(e.currentTarget as HTMLInputElement),
        onInputFocus: handleInputFocus,
        onRemove: handleRemoveAttribute,
      })
    );
  });
  /////////////////////////////////////////////////////////////////////////////////////////

  const onDropdownChange = (e: Event) => {
    const { value } = e.target as HTMLSelectElement;
    const input = currentInput;
    if (!input) return;

    console.log(`onDropdownChange:::: ${value}`);
    
    // if (value === 'string') 
    //   input.oninput = () => handleInputChange(input);
    // else 
    //   input.onchange = () => handleInputChange(input);
    
    // input.type = getInputType(value);

    // if (value === 'boolean') input.checked = false;
    // if (value === 'number') input.value = '0';
    // if (value === 'string') input.value = '';
    // if (value === 'array') {
    //   // TO DO
    // }

    // handleInputChange(input);
    // input.focus();
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
    types: [...dropdownOptions, 'array'],
    onAdd: handleAddAttribute,
  });

  form.appendChild(addView);
  
  const dropdown = createDropdown({
    onChange: onDropdownChange,
    options: dropdownOptions
  });

  return form;
}