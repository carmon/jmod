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
import { resolveExample } from './window.js';
import { openFileLoader, saveToJSON } from './nativefs.js';
import { deepMerge } from './utils.js';

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

const dropdownOptions = ['string', 'number', 'boolean', 'array'];

const onInputFocused = (e: Event) => {
  currentInput = e.currentTarget as HTMLInputElement;
  currentInput.parentElement.appendChild(dropdown);
  dropdown.selectedIndex = dropdownOptions.indexOf(getValueType(currentInput.type));
}

const getValueType = (t: string) =>
  t === 'checkbox' ? 'boolean' : t === 'text' ? 'string' : 'number';

const getInputType = (t: string) => 
  t === 'boolean' ? 'checkbox' : t === 'string' ? 'text' : 'number';

const addAttributesToForm = (obj: any, parent: HTMLElement) => (rootKey: string) => {
  const key = rootKey.includes('-') 
    ? rootKey.split('-')[rootKey.split('-').length - 1]
    : rootKey;
  const label = createLabel({ key });
  const addInputToLabel = (value: any, id: string) => {
    const isNull = value === null; 
    const type = isNull ? 'string' : typeof(value);
    const input = createInput({
      id, 
      onChange: isNull ? undefined : onInputChange,
      onFocus: onInputFocused,
      type: getInputType(type), 
      value: isNull ? 'Value is null' : value,
    });
    label.appendChild(input);
  };
  
  const value = obj[key];
  if (typeof(value) === 'object') {
    if (Array.isArray(value)) {
      value.forEach((v: any, i: number) => 
        addAttributesToForm(value, label)(`${rootKey}-${i}`));
      const btn = createButton({
        onclick: (e) => {
          e.preventDefault();
          const id = `${rootKey}-${value.length}`;
          const type = typeof value[0];
          if (type === 'object') {

          }
          const defaultValue = type === 'number' ? 0 : '';
          addAttributesToForm(value, label)(id);
          label.appendChild(btn);
          value.push(defaultValue);

          preview.value = JSON.stringify(jsonObj, null, 2);
        },
        text: 'Add another'
      });
      label.appendChild(btn);
    } else if (value === null)
      addInputToLabel(value, rootKey);
    else
      Object.keys(value).forEach(k => addAttributesToForm(value, label)(`${rootKey}-${k}`));
  } else {
    addInputToLabel(value, rootKey);
  }
  parent.appendChild(label);
};

let preview: HTMLTextAreaElement | null = null;
let jsonObj: { [key: string]: any } = null;
let dropdown: HTMLSelectElement | null = null;
let currentInput: HTMLInputElement | null = null;

if (window.isSecureContext) {
  // Header
  const header = document.getElementById("header");
  const onOpenJSONClick = async (_: MouseEvent) => {
    button.disabled = true;
    button.textContent = 'Loading...';
    
    // Remove old form & path if present
    if (document.forms[0]) left.removeChild(document.forms[0]);
    const previewEl = document.getElementById('Preview');
    if (previewEl) right.removeChild(previewEl);
    
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
  };

  const button = createButton({
    onclick: onOpenJSONClick,
    text: 'Open JSON',
  });
  header.appendChild(button);

  const pathInput = createInput({
    id: 'filepath',
    value: 'default.json',
    type: 'text'
  });
  header.appendChild(pathInput);

  // Root
  const root = document.getElementById("root");

  const left = createDiv();
  left.appendChild(createTitle({ text: 'Form' }));
  root.appendChild(left);
  
  const right = createDiv();
  right.appendChild(createTitle({ text: 'JSON Preview' }));
  root.appendChild(right);

  
  const saveBtn = createButton({
    onclick: async ev => {
      ev.preventDefault();
      await saveToJSON(preview.value, pathInput.value);
    },
    text: 'Save JSON'
  });
  header.appendChild(saveBtn);

  dropdown = createDropdown({
    onChange: (e) => {
      const { value } = e.target as HTMLSelectElement;
      const input = currentInput;
      
      if (value === 'string') 
        input.oninput = onInputChange;
      else 
        input.onchange = onInputChange;

      console.log(typeof input.value);
      
      input.type = getInputType(value);

      if (value === 'boolean') input.checked = false;
      if (value === 'number') input.value = '0';
      if (value === 'string') input.value = '';

      if (value === 'array') {
        // TO DO
      }

      onInputChange({ currentTarget: input } as EventWrapper);
    },
    options: dropdownOptions
  });

  resolveExample().then(example => {
    jsonObj = JSON.parse(example);
      
    const form = createForm();
    Object.keys(jsonObj)
      .forEach(addAttributesToForm(jsonObj, form));
    left.appendChild(form);
    
    preview = createTextArea({ content: example, id: 'Preview'});
    right.appendChild(preview);

  });
}

console.log('Compiled JS loaded!');