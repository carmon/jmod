import { fileOpen , fileSave, FileSystemHandle } from 'https://unpkg.com/browser-nativefs';

interface LoadResult {
  fileName: string;
  json: string;
}
  
export const openFileLoader = async (): Promise<LoadResult> => {
  const file = await fileOpen({
    mimeTypes: ['application/json'],
    extensions: ['.json'],
    description: 'any JSON file',
  });
  
  const json = await file.text();
  return { fileName: file.name, json };
};

export const saveToJSON = async (textContent: string, fileName: string): Promise<FileSystemHandle> => {
  const blob = new Blob([textContent], {type : 'application/json'});
  return await fileSave(blob, { fileName, extensions: ['.json'] });
}