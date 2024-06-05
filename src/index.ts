import { createPreview } from './dom.js';
import { createView, createError } from './dom.views.js';
import { getSearchWord } from './window.js';
import { saveToJSON } from './nativefs.js';

import createFileInput from './file-input.js';
import createForm from './core/result/form.js';
import createEditForm from './core/edit/edit-form.js';

import loadExample from './load.js';

const core = document.getElementById('core');

if (window.isSecureContext) {  
  let form: HTMLFormElement | null = null;
  let preview: HTMLPreElement | null = null;
  let editForm: HTMLFormElement | null = null;
  let submitPreview: HTMLPreElement | null = null;  
  
  const editformParent = createView({ id: 'edit', title: 'Edit JSON' });
  const previewParent = createView({ id: 'preview', title: 'JSON Preview' });
  const formParent = createView({ id: 'result', title: 'Form Result' });
  const submitParent = createView({ id: 'payload', title: 'Submitted JSON' });

  core.appendChild(editformParent);
  core.appendChild(previewParent);
  core.appendChild(formParent);
  core.appendChild(submitParent);

  const start = (json: string) => {
    submitPreview = createPreview({ content: '', id: 'submitted' });
    const submitValue = (value: string): void => {        
      if (submitPreview) {
        submitPreview.textContent = value;
      }   
    }
    submitParent.appendChild(submitPreview)

    form = createForm({ json, submitValue });
    formParent.appendChild(form);

    preview = createPreview({ content: json, id: 'preview' });
    const setValue = (value: string): void => {        
      if (preview) {
        preview.textContent = value;
      }   
    }
    previewParent.appendChild(preview);

    editForm = createEditForm({ json, setValue });
    editformParent.appendChild(editForm);
  };

  const clean = () => {
    if (submitPreview) {
      submitParent.removeChild(submitPreview);
      submitPreview = null;
    }

    if (form) {
      formParent.removeChild(form);
      form = null;
    }

    if (preview) {
      previewParent.removeChild(preview);
      preview = null;
    }

    if (editForm) {
      editformParent.removeChild(editForm);
      editForm = null;
    }
  };
  
  const w = getSearchWord();
  let filename =  w ? `${w}.json` : 'recursion.json';
  const onChangeFilepath = (ev: Event) => {
    filename = (ev.target as HTMLInputElement).value;
  };

  const onSaveJSONClick = async (ev: MouseEvent) => {
    if (!preview) return;
    ev.preventDefault();
    await saveToJSON(preview.textContent, filename);
  };

  const fileInputParent = document.getElementById("file-input");
  if (fileInputParent) {
    createFileInput({
      filename,
      parent: fileInputParent,
      start,
      clean,
      onChangeFilepath,
      onSaveJSONClick
    });
  } 
  
  loadExample(filename)
    .then(example => {
      start(example);
    });  
} else {
  const error = createError({ error: 'window.isSecureContext is false!' })
  core.append(error);
}

console.log('Compiled JS loaded!');