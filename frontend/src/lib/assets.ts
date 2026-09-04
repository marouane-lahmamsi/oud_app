/** Builds a public-asset URL that also works when the app is served at /oud/. */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  return `${base.replace(/\/?$/, '/')}${path.replace(/^\//, '')}`;
}
