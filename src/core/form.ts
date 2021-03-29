import {
  createButton,
  createDropdown,
  createForm,
  createInput,
  createLabel,
} from '../dom.js';
import { generateTableFrom, generateTableRow } from './table.js';
import { generateInputFrom } from './input.js';
import { /*cloneToDefault,*/ deepMerge, getDefaultValue, setProp, AttributeType, getProp } from './utils.js';
// import { getInputType } from './values.js';
import { generateLabelFrom } from './label.js';

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
  
  const handleTableChange = (e: Event) => {
    console.log('handleTableChange', e);

    const isInput = e.target.constructor === HTMLInputElement;
    if (!isInput) return;  
    
    const input = e.target as HTMLInputElement;
    setProp(jsonObj, input.id.split('-'), getValueFromInput(input));
    setValue(JSON.stringify(jsonObj, null, 2));
  };

  const handleTableClick = (e: Event) => {
    e.preventDefault();

    const isBtn = e.target.constructor === HTMLButtonElement;
    if (!isBtn) return;

    const table = e.currentTarget as HTMLTableElement;
    const path = table.id.split('-');
    
    const value = getProp(jsonObj, path);
    if (!Array.isArray(value)) return;

    const btnId = (e.target as HTMLButtonElement).id;
    const btnKeys = btnId.split('-');

    if (btnKeys[btnKeys.length - 1] === 'rem') {
      const it = Number(btnKeys[btnKeys.length - 2]);
      table.removeChild(table.children[it]);

      value.splice(it, 1); // mutates value
      
      // setProp(jsonObj, path, value);
      setValue(JSON.stringify(jsonObj, null, 2));
    }
    
    if (btnKeys[btnKeys.length - 1] === 'add') {
      const type = typeof value[value.length - 1];
      const defaultValue = getDefaultValue(type as AttributeType);
  
      const lastRow = table.lastElementChild;
      const it = value.length.toString();
      table.appendChild(
        generateTableRow({
          id: `${table.id}-${it}`,
          text: it,
          value: defaultValue as string,
          onInputFocus: handleInputFocus
        })
      );
      table.appendChild(lastRow);
  
      setProp(jsonObj, path, [...value, defaultValue]);
      setValue(JSON.stringify(jsonObj, null, 2));
    }    
  };

  const dropdownOptions = ['string', 'number', 'boolean'];
  let currentInput: HTMLInputElement | null = null;
  
  const handleInputFocus = (e: Event) => {
    currentInput = e.currentTarget as HTMLInputElement;
    if (currentInput && currentInput.parentElement) {
      currentInput.parentElement.appendChild(dropdown);
      dropdown.selectedIndex = dropdownOptions.indexOf(getValueType(currentInput.type));
    }
  }

  // Create form with JSON attributes /////////////////////////////////////////////////////
  const keys = Object.keys(jsonObj);
  keys.forEach(k => {
    form.appendChild(
      generateLabelFrom({
        id: k, 
        value: jsonObj[k],
        onInputChange: (e) => handleInputChange(e.currentTarget as HTMLInputElement),
        onInputFocus: handleInputFocus,
        onTableChange: handleTableChange,
        onTableClick: handleTableClick
      })
    );
  });
  /////////////////////////////////////////////////////////////////////////////////////////

  const onDropdownChange = (e: Event) => {
    const { value } = e.target as HTMLSelectElement;
    const input = currentInput;
    if (!input) return;

    console.log(value);
    
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
  
  const dropdown = createDropdown({
    onChange: onDropdownChange,
    options: dropdownOptions
  });

  const addLabel = createLabel({
    key: 'Add new prop'
  });

  let keyIt = 0;
  const formInput = createInput({
    id: 'formInput',
    type: 'text',
    value: `key${keyIt}`
  });
  const formDropdown = createDropdown({
    options: [...dropdownOptions, 'array']
  });    

  const addBtn = createButton({
    onclick: (e) => {
      e.preventDefault();
      const isArray = Array.isArray(jsonObj); 
      const key = isArray ? `${formInput.value}-${jsonObj.length}` : formInput.value;
      keyIt++;
      formInput.value = `key${keyIt}`;

      if (jsonObj[key] !== undefined) {
        window.alert('Key exists in object!');
        return;
      }

      const defaultValue = getDefaultValue(formDropdown.value as AttributeType);      
      const type = formDropdown.value; 
      const label = createLabel({ key });
      if (type === 'array') {
        const table = generateTableFrom({ 
          id: key, 
          value: [defaultValue], 
          onChange: handleTableChange, 
          onClick: handleTableClick,
          onInputFocus: handleInputFocus
        });
        label.appendChild(table);
        form.appendChild(label);

        jsonObj = isArray ? [...jsonObj, defaultValue] : { ...jsonObj, [key]: [defaultValue] };
      } else {
        const input = generateInputFrom({ 
          id: key, 
          value: defaultValue as string | boolean,
          onChange: (e: Event) => handleInputChange(e.currentTarget as HTMLInputElement),
          onFocus: handleInputFocus
        });
        label.appendChild(input);
        form.appendChild(label);
        input.focus();

        jsonObj = isArray ? [...jsonObj, defaultValue] : { ...jsonObj, [key]: defaultValue };
      }      
      
      form.appendChild(addLabel);

      setValue(JSON.stringify(jsonObj, null, 2));
    },
    text: 'Add'
  });

  addLabel.appendChild(formInput);
  addLabel.appendChild(formDropdown);
  addLabel.appendChild(addBtn);

  form.appendChild(addLabel);

  return form;
}