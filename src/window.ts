export const getSearchWord = (): string | undefined => {
  const res = /\?(\w+)/g.exec(window.location.search);
  return res ? res[1] : undefined;
}