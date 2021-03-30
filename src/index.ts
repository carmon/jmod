import {
  createTextArea,
} from './dom.js';
import { getSearchWord } from './window.js';
import { saveToJSON } from './nativefs.js';

import createFileInput from './file-input.js';
import createForm from './core/form.js';

import loadExample from './load.js';

if (window.isSecureContext) {  
  let form: HTMLFormElement | null = null;
  let preview: HTMLTextAreaElement | null = null;
  
  const formParent = document.getElementById("formParent");
  const previewParent = document.getElementById("previewParent");
  if (formParent && previewParent) {
    const start = (json: string) => {  
      preview = createTextArea({ content: json, id: 'Preview'});
      const setValue = (value: string): void => {
        if (preview)
          preview.value = value;
      }
      previewParent.appendChild(preview);
  
      form = createForm({ json, setValue });
      formParent.appendChild(form);
    };
  
    const clean = () => {
      if (preview) {
        previewParent.removeChild(preview);
        preview = null;
      }

      if (form) {
        formParent.removeChild(form);
        form = null;
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
      await saveToJSON(preview.value, filename);
    };
  
    const fileInputParent = document.getElementById("file-input");
    if (fileInputParent) {
      createFileInput({
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
  }  
} else {
  window.alert('window.isSecureContext is false!');
}

console.log('Compiled JS loaded!');