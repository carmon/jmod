// DOM utility, has direct access to document global object
interface ButtonProps {
  className?: string;
  id?: string;
  onclick?: (ev: MouseEvent) => void;
  text: string;
}

export const createButton = ({ className, id, onclick, text }: ButtonProps): HTMLButtonElement => {
  const button = document.createElement('button');
  if (className) button.className = className;
  if (id) button.id = id;
  button.onclick = onclick || null;
  button.textContent = text;
  button.type = 'button';
  return button;
};

interface LabelProps {
  className?: string;
  htmlFor?: string;
  id?: string;
  text?: string;
}

export const createLabel = ({ className, htmlFor, id, text }: LabelProps): HTMLLabelElement => {
  const label = document.createElement('label');
  if (className) label.className = className;
  if (htmlFor) label.htmlFor = htmlFor;
  label.id = id || '';
  label.style.borderColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
  label.textContent = text;
  return label;
};

export const createLineBreak = (): HTMLBRElement => document.createElement('br');

export const createForm = (): HTMLFormElement => document.createElement('form');

interface InputProps {
  disabled?: boolean;
  id: string;
  onChange?: (e: Event) => void;
  onFocus?: (e: Event) => void; 
  type: 'text' | 'number' | 'checkbox';
  value: boolean | string;
}

export const createInput = ({ disabled, id, onChange, onFocus, type, value }: InputProps): HTMLInputElement => {
  const input = document.createElement('input');
  input.disabled = !!disabled;
  input.id = id;
  input.type = type;
  if (onChange) 
    input.oninput = onChange;

  input.onkeydown = (e) => {    
    if (e.key === 'Enter')
      e.preventDefault();
  }
  
  input.onfocus = onFocus || null;
  if (type === 'checkbox')
    input.checked = value as boolean;
  else
    input.value = value as string;
  return input;
};

interface DropdownProps {
  onChange?: (e: Event) => void;
  options: string[];
}

export const createDropdown = ({ onChange, options }: DropdownProps): HTMLSelectElement => {
  const sel = document.createElement('select');
  options.forEach(o => {
    const opt = document.createElement('option');
    opt.textContent = o;
    opt.value = o;
    sel.appendChild(opt);
  });
  sel.onchange = onChange;
  return sel;
};