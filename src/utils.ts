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

type AttributeType = 'string' | 'number' | 'boolean';

export const getDefaultValue = (type: AttributeType): string | number | boolean =>
  type === "boolean" ? false : type === "string" ? '' : 0;   

/**
 * Clones an object to a new object with default values
 * @param source Object to clone
 */
export const shallowClone = (source: Object): Object =>
  Object.keys(source).reduce((prev, curr) => {
    const value = (<any>source)[curr];
    const type = typeof value;

    type ValidType = AttributeType | 'object';
    type ValidValueType = string | boolean | number | object;

    const resolveType = (t: ValidType): ValidValueType => {
      if (t === 'object') {
        if (Array.isArray(value))
          return value.map(v => resolveType(typeof v as ValidType));
        else if (value === null)
          return null;
        
        return shallowClone(value);
      }
      return getDefaultValue(t as AttributeType);
    }
    return { ...prev, [curr]: resolveType(type as ValidType)};
  }, {});

/// Async examples load

const EXAMPLES_ROOT = './examples';

export const loadExample = async (filename: string): Promise<string> => {
  const opts = { method: 'GET' };
  const res = await fetch(`${EXAMPLES_ROOT}/${filename}`, opts);
  if (!res.ok) {
    const recursion = await fetch(`${EXAMPLES_ROOT}/recursion.json`, opts);
    return await recursion.text();
  }
    
  return await res.text();
};