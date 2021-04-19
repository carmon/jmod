// Danger: Mutation ops ahead
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
  if (keys.length > 1) {
    object[keys[0]] = object[keys[0]] || {};
    if (Array.isArray(object[keys[0]])) {
      if (keys.length > 1) {
        const [first, ...rest] = keys;
        deleteProp(object[first] as Record<string, unknown>, rest);
      }
      else {
        (object[keys[0]] as unknown[]).splice(Number(keys[1]), 1);
      }
    }
    else {
      deleteProp(object[keys[0]] as Record<string, unknown>, keys.slice(1));
    } 
    
    return;
  }
  if (Array.isArray(object))
    (object as unknown[]).splice(Number(keys[0]), 1);
  else
    delete object[keys[0]];
}