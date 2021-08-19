import { createPreview } from './dom.js';
import { getSearchWord } from './window.js';
import { saveToJSON } from './nativefs.js';

import createFileInput from './file-input.js';
import createForm from './core/form.js';

import loadExample from './load.js';

if (window.isSecureContext) {  
  let form: HTMLFormElement | null = null;
  let preview: HTMLPreElement | null = null;
  
  const formParent = document.getElementById("formParent");
  const previewParent = document.getElementById("previewParent");
  if (formParent && previewParent) {
    const start = (json: string) => {
      preview = createPreview({ content: json, id: 'preview' });
      const setValue = (value: string): void => {        
        if (preview) {
          preview.textContent = value;
        }   
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
  }  
} else {
  window.alert('window.isSecureContext is false!');
}

console.log('Compiled JS loaded!');