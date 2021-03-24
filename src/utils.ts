export const deepMerge = (source: Record<string, unknown>, target: Record<string, unknown>): Record<string, unknown> => {
  const result = { ...source,...target };
  const keys = Object.keys(result);

  for (const key of keys){
    const sprop = source[key];
    const tprop = target[key];
      
    if(typeof(tprop) == 'object' && typeof(sprop) == 'object') {
      if (Array.isArray(tprop) && Array.isArray(sprop)) 
        result[key] = tprop; // This is by design, target array overwrites source array
      else
        result[key] = deepMerge(sprop as Record<string, unknown>, tprop as Record<string, unknown>);
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
export const shallowClone = (source: Record<string, unknown>): Record<string, unknown> =>
  Object.keys(source).reduce((prev, curr) => {
    const value = source[curr];
    const type = typeof value;

    type ValidType = AttributeType | 'object';
    // This type sucks :point-down:
    type ValidValueType = string | boolean | number | Record<string, unknown> | unknown[];

    const resolveType = (t: ValidType): ValidValueType => {
      if (t === 'object') {
        if (Array.isArray(value))
          return value.map(v => resolveType(typeof v as ValidType));
        else if (value === null)
          return null;
        
        return shallowClone(value as Record<string, unknown>);
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