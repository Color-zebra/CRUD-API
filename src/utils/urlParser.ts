export const parseURL = (url: string) => {
  const [path, paramsString] = url.split('?');
  const pathWithoutTrailingSlash = path.endsWith('/')
    ? path.slice(0, -1)
    : path;
  const query: Record<string, string> = {};

  if (paramsString) {
    paramsString.split('&').forEach((pair: string) => {
      const [key, val] = pair.split('=');
      if (key && val) {
        query[key] = val;
      }
    });
  }
  return {
    path: pathWithoutTrailingSlash,
    query,
  };
};
