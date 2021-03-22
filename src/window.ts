export const resolveExample = async (): Promise<string> => {
  const res = /\?(\w+)/.exec(window.location.search);
  if (res) {
    const file = res[1];
    if (file) {
      const response = await fetch(`./examples/${file}.json`, { method: 'GET' });
      if (response) 
        return await response.text();
    }
  }

  const recursion = await fetch('./examples/recursion.json', { method: 'GET' });
  return await recursion.text();
}