import { 
  createButton,
  createDropdown,
  createForm,
  createInput,
  createLabel,
  createTextArea,
} from './dom.js';
import { getSearchWord } from './window.js';
import { saveToJSON } from './nativefs.js';
import { deepMerge, loadExample, shallowClone } from './utils.js';

import createFileInput from './components/file-input.js';

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
  preview.value = JSON.stringify(jsonObj, null, 2);
};
const dropdownOptions = ['string', 'number', 'boolean'];

const onInputFocused = (e: Event) => {
  currentInput = e.currentTarget as HTMLInputElement;
  currentInput.parentElement.appendChild(dropdown);
  dropdown.selectedIndex = dropdownOptions.indexOf(getValueType(currentInput.type));
}
const getValueType = (t: string) =>
  t === 'checkbox' ? 'boolean' : t === 'text' ? 'string' : 'number';

const getInputType = (t: string) => 
  t === 'boolean' ? 'checkbox' : t === 'string' ? 'text' : 'number';

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
          const type = typeof value[0];
          if (type === 'object') {
            if (Array.isArray(value[0])) {
              // TO DO
            }
            const clone = shallowClone(value[0]);
            Object.keys(clone).forEach(k => addAttributeToForm(`${id}-${k}`, (<Record<string, unknown>>clone)[k], label));
            value.push(clone);
          } else {
            const defaultValue = type === 'number' ? 0 : '';
            addAttributeToForm(id, value, label);
            value.push(defaultValue);
          }
          label.appendChild(btn);

          preview.value = JSON.stringify(jsonObj, null, 2);
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

let form: HTMLFormElement | null = null;
let preview: HTMLTextAreaElement | null = null;
let jsonObj: { [key: string]: unknown } = null;
let dropdown: HTMLSelectElement | null = null;
let currentInput: HTMLInputElement | null = null;

const fillForm = (obj: Record<string, unknown>) => {
  Object.keys(obj)
    .forEach(k => addAttributeToForm(k, obj[k], form));
}


if (window.isSecureContext) {  
  const formParent = document.getElementById("formParent");
  const previewParent = document.getElementById("previewParent");

  const start = (json: string) => {
    console.log('start');
    jsonObj = JSON.parse(json);

    form = createForm();
    fillForm(jsonObj);
    formParent.appendChild(form); 
  
    preview = createTextArea({ content: json, id: 'Preview'});
    previewParent.appendChild(preview);
  };
  
  const clean = () => {
    console.log('clean');
    formParent.removeChild(form);
    form = null;
    previewParent.removeChild(preview);
    preview = null;
  };

  const w = getSearchWord();
  let filename =  w ? `${w}.json` : 'recursion.json';
  const onChangeFilepath = (ev: InputEvent) => {
    filename = (ev.target as HTMLInputElement).value;
  };

  const onSaveJSONClick = async (ev: MouseEvent) => {
    ev.preventDefault();
    await saveToJSON(preview.value, filename);
  };

  createFileInput({
    parent: document.getElementById("file-input"),
    start,
    clean,
    onChangeFilepath,
    onSaveJSONClick
  });
  
  dropdown = createDropdown({
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

  
  loadExample(filename).then(example => {
    start(example);
  });
}

console.log('Compiled JS loaded!');