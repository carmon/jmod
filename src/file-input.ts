import { 
  createButton,
  createInput,
} from './dom.js';

import { openFileLoader } from './nativefs.js';

interface FileInputProps {
    parent:  HTMLElement;
    start: (json: string) => void;
    clean: () => void;
    onChangeFilepath: (ev: InputEvent) => void;
    onSaveJSONClick: (ev: MouseEvent) => void;
}

export default ({
  parent,
  start,
  clean,
  onChangeFilepath,
  onSaveJSONClick
}: FileInputProps): void => {
  const onOpenJSONClick = async () => {
    openBtn.disabled = true;
    openBtn.textContent = 'Loading...';
    
    clean();

    const { fileName, json } = await openFileLoader();
        
    pathInput.value = fileName;
        
    openBtn.disabled = false;
    openBtn.textContent = 'Open JSON';
        
    start(json);
  };

  const openBtn = createButton({
    onclick: onOpenJSONClick,
    text: 'Open JSON',
  });
  parent.appendChild(openBtn);
    
  const pathInput = createInput({
    id: 'filepath',
    onChange: onChangeFilepath,
    value: 'default.json',
    type: 'text'
  });
  parent.appendChild(pathInput);
    
  const saveBtn = createButton({
    onclick: onSaveJSONClick,
    text: 'Save JSON'
  });
  parent.appendChild(saveBtn);
};