export const getInputType = (t: string): 'checkbox' | 'text' | 'number' => 
  t === 'boolean' ? 'checkbox' : t === 'string' ? 'text' : 'number';

export const getValueType = (t: string): 'boolean' | 'string' | 'number' =>
  t === 'checkbox' ? 'boolean' : t === 'text' ? 'string' : 'number';

export const dropdownOptions = ['string', 'number', 'boolean', 'array'];