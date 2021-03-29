
export type AttributeType = 'string' | 'number' | 'boolean';

export const getDefaultValue = (type: AttributeType): string | number | boolean =>
  type === "boolean" ? false : type === "string" ? '' : 0;   

// Danger: Mutation
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

export const deleteProp = (object: Record<string, unknown>, keys: string[]): void => {
  if(keys.length > 1){
    object[keys[0]] = object[keys[0]] || {};
    if (Array.isArray(object[keys[0]]))
      (object[keys[0]] as unknown[]).splice(Number(keys[1]), 1);
    else 
      deleteProp(object[keys[0]] as Record<string, unknown>, keys.slice(1));
    
    return;
  }
  delete object[keys[0]];
}