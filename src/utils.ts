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