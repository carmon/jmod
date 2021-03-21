import { 
  createButton, 
  createDiv, 
  createDropdown,
  createForm,
  createInput,
  createLabel,
  createTextArea, 
  createTitle
} from './dom.js';
import { BIGARRAY } from './examples.js';
import { openFileLoader, saveToJSON } from './nativefs.js';
import { deepMerge } from './utils.js';

const header = document.getElementById("header"); 
const root = document.getElementById("root");

interface EventWrapper extends Event {
  currentTarget: HTMLInputElement;
}

const onInputChange = (e: EventWrapper) => {
  const getTypeCast = (type: string, value: string) => 
    type === 'number' ? Number(value) : value;
  
  const { id, value, type, checked } = e.currentTarget;
  const targetValue = type === 'checkbox' ? checked : getTypeCast(type, value);
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
        (prev, curr): Object => ({ [curr]: prev }),
        parentValue
      );
    } else {
      modified = keys.reduceRight(
        (prev, curr): Object => ({ [curr]: prev }),
        targetValue
      );
    }

    jsonObj = deepMerge(jsonObj, modified);
  } else {
    jsonObj[id] = targetValue;
  }

  preview.value = JSON.stringify(jsonObj, null, 2);
};

const onInputFocused = (e: Event) => {
  currentInput = e.currentTarget as HTMLInputElement;
  currentInput.parentElement.appendChild(dropdown);
}

const getInputType = (t: string) => 
  t === 'boolean' ? 'checkbox' : t === 'string' ? 'text' : 'number';

const addInputToLabel = (label: HTMLLabelElement, value: any, id: string, ref?: HTMLButtonElement) => {
  const isNull = value === null; 
  const type = isNull ? 'string' : typeof(value);
  const input = createInput({
    // disabled: isNull,
    id, 
    onChange: isNull ? undefined : onInputChange,
    onFocus: onInputFocused,
    type: getInputType(type), 
    value: isNull ? 'Value is null' : value,
  });
  if (ref)
    label.insertBefore(input, ref);
  else
    label.appendChild(input);
};

const addAttributesToForm = (obj: any, parent: HTMLElement) => (rootKey: string) => {
  const key = rootKey.includes('-') 
    ? rootKey.split('-')[rootKey.split('-').length - 1]
    : rootKey;
  const label = createLabel({ key });
  
  const value = obj[key];
  if (typeof(value) === 'object') {
    if (Array.isArray(value)) {
      value.forEach((v: any, i: number) => 
        addAttributesToForm(value, label)(`${rootKey}-${i}`));
        // addInputToLabel(label, v, `${rootKey}-${i}`));      
      const btn = createButton({
        onclick: (e) => {
          e.preventDefault();
          const id = `${rootKey}-${value.length}`;
          const type = typeof value[0];
          if (type === 'object') {
            
          }
          const defaultValue = type === 'number' ? 0 : '';
          addInputToLabel(label, defaultValue, id, btn);
          value.push(defaultValue);

          preview.value = JSON.stringify(jsonObj, null, 2);
        },
        text: 'Add another'
      });
      label.appendChild(btn);
    } else if (value === null)
      addInputToLabel(label, value, rootKey);
    else
      Object.keys(value).forEach(k => addAttributesToForm(value, label)(`${rootKey}-${k}`));
  } else {
    addInputToLabel(label, value, rootKey);
  }
  parent.appendChild(label);
};

let preview: HTMLTextAreaElement | null = null;
let jsonObj: { [key: string]: any } = null;
let dropdown: HTMLSelectElement | null = null;
let currentInput: HTMLInputElement | null = null;

if (window.isSecureContext) {
  const button = createButton({
    onclick: async _ => {
      button.disabled = true;
      button.textContent = 'Loading...';
      
      // Remove old form & path if present
      if (document.forms[0]) left.removeChild(document.forms[0]);
      const previewEl = document.getElementById('Preview');
      if (previewEl) right.removeChild(preview);
      
      const { fileName, json } = await openFileLoader();

      // Save to target filename
      pathInput.value = fileName;
  
      button.disabled = false;
      button.textContent = 'Open JSON';
  
      jsonObj = JSON.parse(json);

      const form = createForm();
      Object.keys(jsonObj)
        .forEach(addAttributesToForm(jsonObj, form));
      left.appendChild(form); 

      preview = createTextArea({ content: json, id: 'Preview'});
      right.appendChild(preview);
    },
    text: 'Open JSON',
  });
  header.appendChild(button);

  const pathInput = createInput({
    disabled: true,
    id: 'filename',
    value: 'default.json',
    type: 'text'
  });
  header.appendChild(pathInput);

  const saveBtn = createButton({
    onclick: async ev => {
      ev.preventDefault();
      await saveToJSON(preview.value, pathInput.value);
    },
    text: 'Save JSON'
  });
  header.appendChild(saveBtn);
  
  jsonObj = JSON.parse(BIGARRAY);
  const left = createDiv();
  left.appendChild(createTitle({ text: 'Form' }));

  const form = createForm();
  Object.keys(jsonObj)
    .forEach(addAttributesToForm(jsonObj, form));
  left.appendChild(form);

  dropdown = createDropdown({
    onChange: (e) => {
      const { value } = e.target as HTMLSelectElement;
      const input = currentInput;
      // input.disabled = false;
      
      if (value === 'string') 
        input.oninput = onInputChange;
      else 
        input.onchange = onInputChange;
      
      input.type = getInputType(value);

      if (value === 'boolean') input.checked = false;
      if (value === 'number') input.value = '0';
      if (value === 'string') input.value = '';

      onInputChange({ currentTarget: input } as EventWrapper);
    },
    options: ['string', 'number', 'boolean']
  });  
  
  root.appendChild(left);

  preview = createTextArea({ content: BIGARRAY, id: 'Preview'});
  const right = createDiv();
  right.appendChild(createTitle({ text: 'Preview' }));
  right.appendChild(preview);  
  root.appendChild(right);
}

console.log('Compiled JS loaded!');