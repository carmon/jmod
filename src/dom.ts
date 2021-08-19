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
  
  input.onfocus = onFocus || null;
  if (type === 'checkbox')
    input.checked = value as boolean;
  else
    input.value = value as string;
  return input;
};

interface PreviewProps {
  content: string;
  id?: string;
}

export const createPreview = ({ content, id }: PreviewProps): HTMLPreElement => {
  const pre = document.createElement('pre');
  pre.id = id || null;
  pre.textContent = content;
  return pre;
};