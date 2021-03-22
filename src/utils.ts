export const deepMerge = (source: Object, target: Object): Object => {
  const result = { ...source,...target };
  const keys = Object.keys(result);

  for (const key of keys){
    const sprop = (<any>source)[key];
    const tprop = (<any>target)[key];
      
    if(typeof(tprop) == 'object' && typeof(sprop) == 'object') {
      if (Array.isArray(tprop) && Array.isArray(sprop)) 
        (<any>result)[key] = tprop; // This is by design, target array overwrites source array
      else
        (<any>result)[key] = deepMerge(sprop, tprop);
    }
  }

  return result;
}

const EXAMPLES_ROOT = './examples';

export const loadExample = async (filename: string): Promise<string> => {
  const res = await fetch(`${EXAMPLES_ROOT}/${filename}`, { method: 'GET' });
  if (res.status < 400) 
      return await res.text();

  const recursion = await fetch(`${EXAMPLES_ROOT}/recursion.json`, { method: 'GET' });
  return await recursion.text();
};