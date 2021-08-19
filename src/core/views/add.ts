import { createButton, createDropdown, createInput, createLabel } from "../../dom.core.js";

interface AddViewProps {
  key?: string;
  noKey?: boolean;
  types: string[];
  onAdd: (key: string, type: string) => void;
}

const createContainer = (text: string, child: HTMLInputElement | HTMLSelectElement) => {
  const label = createLabel({ text });
  label.appendChild(child);
  return label;
};

export const generateAddView = ({ key, noKey, types, onAdd }: AddViewProps): HTMLLabelElement => {
  const label = createLabel({
    id: 'add',
    text: 'Add' 
  });  
  const formDropdown = createDropdown({
    options: types
  });
  if (noKey) {
    label.appendChild(createContainer('ValueType', formDropdown));
    label.appendChild(createButton({
      className: 'add-btn',
      onclick: () => { onAdd(null, formDropdown.value); },
      text: 'Add'
    }));
  } else {
    let keyIt = 0;
    const formInput = createInput({
      id: `${key}-input`,
      type: 'text',
      value: `key${keyIt}`
    });
    label.appendChild(createContainer('Key', formInput));
    label.appendChild(createContainer('ValueType', formDropdown));
    label.appendChild(createButton({
      className: 'add-btn',
      onclick: () => {
        onAdd(formInput.value, formDropdown.value);
        if (formInput.value === `key${keyIt}`)
          keyIt++;
        
        formInput.value = `key${keyIt}`;
      },
      text: 'Add'
    }));
  }
  return label;
};