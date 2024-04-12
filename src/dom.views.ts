// DOM views inyector

interface Common {
  id?: string;
}
interface ViewProps extends Common {
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

interface ErrorProps extends Common {
  error: string;
}

export const createError = ({ id, error }: ErrorProps): HTMLDivElement => {
  const view = document.createElement('div');
  const h3 = document.createElement('h3');
  h3.textContent = error;
  view.id = id || '';
  view.appendChild(h3);
  return view;
};
