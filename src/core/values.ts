export const getInputType = (t: string): 'checkbox' | 'text' | 'number' => 
  t === 'boolean' ? 'checkbox' : t === 'string' ? 'text' : 'number';

export const getValueType = (t: string): 'boolean' | 'string' | 'number' =>
  t === 'checkbox' ? 'boolean' : t === 'text' ? 'string' : 'number';


export type AvailableTypes = 'array' | 'boolean' | 'object' | 'number' | 'string';


export const dropdownOptions = ['string', 'number', 'boolean', 'array', 'object'];

export type AttributeType = 'string' | 'number' | 'boolean';

export const getDefaultValue = (type: AttributeType): string | number | boolean =>
  type === "boolean" ? false : type === "string" ? '' : 0;   