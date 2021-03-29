import { createButton, createTable, createTableCell, createTableRow } from "../dom.js";
import { generateInputFrom } from "./input.js";

export const generateTableRow = (text: string, value: string, id: string): HTMLTableRowElement => {
  const row = createTableRow();
  row.appendChild(
    createTableCell({ text })
  );
  const val = createTableCell();
  val.appendChild(generateInputFrom({value, id}));
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
}

export const generateTableFrom = ({ id, value, onChange, onClick }: TableFromProps): HTMLTableElement => {
  const t = createTable({ 
    id, 
    onChange, 
    onClick
  });
  value.forEach((childValue, i) => {
    t.appendChild(
      generateTableRow(i.toString(), childValue as string, `${id}-${i}`)
    );
  });

  // Last row
  const last = createTableRow();
  last.appendChild(
    createTableCell()
  );
  const add = createTableCell();
  add.appendChild(
    createButton({ id: `${id}-add`, text: 'Add'})
  );
  last.appendChild(add);
  last.appendChild(
    createTableCell()
  );
  t.appendChild(last);
  return t;
};