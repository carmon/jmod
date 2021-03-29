import { createButton, createTable, createTableCell, createTableRow } from "../dom.js";
import { generateInputFrom } from "./input.js";

interface TableRowFromProps {
  id: string;
  text: string;
  value: string;
  onInputFocus?: (e: Event) => void;
}

export const generateTableRow = ({
  id,
  text, 
  value,
  onInputFocus 
}: TableRowFromProps): HTMLTableRowElement => {
  const row = createTableRow();
  row.appendChild(
    createTableCell({ text })
  );
  const val = createTableCell();
  val.appendChild(
    generateInputFrom({ id, value, onFocus: onInputFocus })
  );
  row.appendChild(val);
  const rem = createTableCell();
  rem.appendChild(
    createButton({ id: `${id}-rem`, text: 'X' })
  );
  row.appendChild(rem);
  return row;
};

interface TableFromProps {
  id: string;
  value: unknown[];
  onChange: (e: Event) => void;
  onClick: (e: Event) => void;
  onInputFocus?: (e: Event) => void;
}

export const generateTableFrom = ({ id, value, onChange, onClick, onInputFocus }: TableFromProps): HTMLTableElement => {
  const t = createTable({ 
    id, 
    onChange, 
    onClick
  });
  value.forEach((childValue, i) => {
    t.appendChild(
      generateTableRow({ 
        id: `${id}-${i}`,
        text: i.toString(), 
        value: childValue as string,
        onInputFocus,
      }) 
    );
  });

  // Last row
  const last = createTableRow();
  last.appendChild(
    createTableCell()
  );
  const add = createTableCell();
  add.appendChild(
    createButton({ id: `${id}-add`, text: 'Add' })
  );
  last.appendChild(add);
  last.appendChild(
    createTableCell()
  );
  t.appendChild(last);
  return t;
};