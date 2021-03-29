import { createButton, createDropdown, createInput, createLabel } from "../../dom.js";

interface AddViewProps {
  types: string[];
  onAdd: (key: string, type: string) => void;
}

export const generateAddView = ({ types, onAdd }: AddViewProps): HTMLLabelElement => {
  const label = createLabel({ text: 'Add new attribute' });
  const formDropdown = createDropdown({
    options: types
  });

  let keyIt = 0;
  const formInput = createInput({
    id: 'formInput',
    type: 'text',
    value: `key${keyIt}`
  });
  label.appendChild(formInput);
  label.appendChild(formDropdown);
  label.appendChild(createButton({
    onclick: () => {
      onAdd(formInput.value, formDropdown.value);
      keyIt++;
      formInput.value = `key${keyIt}`;
    },
    text: 'Add'
  }));
  return label;
};