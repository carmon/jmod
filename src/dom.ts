// DOM utility, has direct access to document global object

// Begin core
interface ButtonProps {
  onclick?: (ev: MouseEvent) => void;
  text: string;
}

export const createButton = ({ onclick, text }: ButtonProps) => {
  const button = document.createElement('button');
  button.onclick = onclick;
  button.textContent = text;
  return button;
};

interface LabelProps {
  key: string;
  text?: string;
}

export const createLabel = ({ key }: LabelProps) => {
  const label = document.createElement('label');
  label.htmlFor = key;
  label.textContent = key;
  return label;
};

export const createForm = () => document.createElement('form');

interface InputProps {
  disabled?: boolean;
  id: string;
  onChange?: (e: Event) => void;
  onFocus?: (e: Event) => void; 
  type: 'text' | 'number' | 'checkbox';
  value: boolean | string;
};

export const createInput = ({ disabled, id, onChange, onFocus, type, value }: InputProps) => {
  const input = document.createElement('input');
  input.disabled = !!disabled;
  input.id = id;
  input.type = type;
  if (onChange) {
    if (type === 'text') 
      input.oninput = onChange;
    else
      input.onchange = onChange;
  }
  input.onfocus = onFocus;
  if (type === 'checkbox')
    input.checked = value as boolean;
  else
    input.value = value as string;
  return input;
};

interface TextAreaProps {
  content: string;
  id?: string;
}

export const createTextArea = ({ content, id }: TextAreaProps): HTMLTextAreaElement => {
  const textArea = document.createElement('textarea');
  textArea.value = content;
  textArea.id = id;
  textArea.disabled = true;
  textArea.readOnly = true;
  return textArea;
}
// End core

// Begin type switcher
interface DropdownProps {
  onChange: (e: Event) => void;
  options: string[];
}

export const createDropdown = ({ onChange, options }: DropdownProps): HTMLSelectElement => {
  const sel = document.createElement('select');
  [ "--Select and option", ...options].forEach(o => {
    const opt = document.createElement('option');
    opt.textContent = o;
    opt.value = o; 
    sel.appendChild(opt);
  });
  sel.onchange = onChange;
  return sel;
};
// End type switcher

// Begin graphic utilities
export const createDiv = (): HTMLDivElement => {
  const div = document.createElement('div');
  return div;
}

interface TitleProps {
  text: string;
}

export const createTitle = ({ text }: TitleProps): HTMLDivElement => {
  const h3 = document.createElement('h3');
  h3.textContent = text;
  return h3;
}
// End graphic utilities