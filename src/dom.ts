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
  text?: string;
}

export const createLabel = ({ className, htmlFor, text }: LabelProps): HTMLLabelElement => {
  const label = document.createElement('label');
  if (className) label.className = className;
  if (htmlFor) label.htmlFor = htmlFor;
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
  
  input.onfocus = onFocus || null;
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
  textArea.id = id || '';
  textArea.disabled = true;
  textArea.readOnly = true;
  return textArea;
}
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

interface TableProps {
  id: string;
  onChange: (e: Event) => void;
  onClick: (e: Event) => void;
}

export const createTable = ({ id, onChange, onClick }: TableProps): HTMLTableElement => {
  const t = document.createElement('table');
  t.id = id;
  t.oninput = onChange;
  t.onclick = onClick;
  return t;
}

export const createTableRow = (): HTMLTableRowElement => document.createElement('tr');

interface TableCellProps {
  text?: string;
}

export const createTableCell = (props?: TableCellProps): HTMLTableDataCellElement => {
  const cell = document.createElement('td');
  if (props) {
    cell.textContent = props.text;
  }
  return cell;
} 