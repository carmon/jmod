
const EXAMPLES_ROOT = './examples';

export default async (filename: string): Promise<string> => {
  const opts = { method: 'GET' };
  const res = await fetch(`${EXAMPLES_ROOT}/${filename}`, opts);
  if (!res.ok) {
    const recursion = await fetch(`${EXAMPLES_ROOT}/recursion.json`, opts);
    return await recursion.text();
  }
    
  return await res.text();
};