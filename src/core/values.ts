export const getInputType = (t: string): 'checkbox' | 'text' | 'number' => 
  t === 'boolean' ? 'checkbox' : t === 'string' ? 'text' : 'number';