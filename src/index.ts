import {
  createTextArea,
} from './dom.js';
import { getSearchWord } from './window.js';
import { saveToJSON } from './nativefs.js';

import createFileInput from './components/file-input.js';
import createForm from './components/form.js';

import loadExample from './load.js';

if (window.isSecureContext) {  
  let form: HTMLFormElement = null;
  let preview: HTMLTextAreaElement = null;
  
  const formParent = document.getElementById("formParent");
  const previewParent = document.getElementById("previewParent");

  const start = (json: string) => {
    console.log('start');

    preview = createTextArea({ content: json, id: 'Preview'});
    const setValue = (value: string): void => {
      preview.value = value;
    }
    previewParent.appendChild(preview);

    form = createForm({
      formParent,
      json,
      setValue
    });
    formParent.appendChild(form);
  };
  
  const w = getSearchWord();
  let filename =  w ? `${w}.json` : 'recursion.json';
  const onChangeFilepath = (ev: InputEvent) => {
    filename = (ev.target as HTMLInputElement).value;
  };

  const onSaveJSONClick = async (ev: MouseEvent) => {
    ev.preventDefault();
    await saveToJSON(preview.value, filename);
  };

  createFileInput({
    parent: document.getElementById("file-input"),
    start,
    clean: () => {
      console.log('clean');
  
      previewParent.removeChild(preview);
      preview = null;
      
      formParent.removeChild(form);
      form = null;
    },
    onChangeFilepath,
    onSaveJSONClick
  });
  
  loadExample(filename)
    .then(example => {
      start(example);
    });
} else {
  window.alert('window.isSecureContext is false!');
}

console.log('Compiled JS loaded!');