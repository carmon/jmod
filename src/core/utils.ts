/**
 * Merges two objects, target arrays prevail
 * @param source source object
 * @param target target object, arrays first
 * @returns merged object
 */
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

export type AttributeType = 'string' | 'number' | 'boolean';

export const getDefaultValue = (type: AttributeType): string | number | boolean =>
  type === "boolean" ? false : type === "string" ? '' : 0;   

/**
 * Clones an object to a new object with default values
 * @param source object to clone
 * @returns cloned object
 */
export const cloneToDefault = (source: Record<string, unknown>): Record<string, unknown> =>
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
        
        return cloneToDefault(value as Record<string, unknown>);
      }
      return getDefaultValue(t as AttributeType);
    }
    return { ...prev, [curr]: resolveType(type as ValidType)};
  }, {});

// Danger: Mutation
/* Implementation of lodash.set function */
export const setProp = (object: Record<string, unknown>, keys: string[], val: unknown): void => {
  if(keys.length > 1){
    object[keys[0]] = object[keys[0]] || {};
    setProp(object[keys[0]] as Record<string, unknown>, keys.slice(1), val);
    return;
  }
  object[keys[0]] = val;
}

export const getProp = (object: Record<string, unknown>, keys: string[]): unknown => {
  const value = keys.reduce(
    (prev, curr) => prev[curr],
    object
  );
  return value;
}
