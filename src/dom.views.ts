// DOM views inyector
interface ViewProps {
  id?: string;
  title: string;
}

export const createView = ({ id, title }: ViewProps): HTMLDivElement => {
  const view = document.createElement('div');
  const h3 = document.createElement('h3');
  h3.textContent = title;
  view.id = id || '';
  view.appendChild(h3);
  return view;
};