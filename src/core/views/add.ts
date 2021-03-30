import { createButton, createDropdown, createInput, createLabel } from "../../dom.js";

interface AddViewProps {
  types: string[];
  onAdd: (key: string, type: string) => void;
}

const createContainer = (text: string, child: HTMLInputElement | HTMLSelectElement) => {
  const label = createLabel({ text });
  label.appendChild(child);
  return label;
};

export const generateAddView = ({ types, onAdd }: AddViewProps): HTMLLabelElement => {
  const label = createLabel({
    className: 'add-view',
    text: 'Add new attribute' 
  });
  const formDropdown = createDropdown({
    options: types
  });

  let keyIt = 0;
  const formInput = createInput({
    id: 'formInput',
    type: 'text',
    value: `key${keyIt}`
  });
  label.appendChild(createContainer('Key', formInput));
  label.appendChild(createContainer('ValueType', formDropdown));
  label.appendChild(createButton({
    className: 'add-btn',
    onclick: () => {
      onAdd(formInput.value, formDropdown.value);
      keyIt++;
      formInput.value = `key${keyIt}`;
    },
    text: 'Add'
  }));
  return label;
};