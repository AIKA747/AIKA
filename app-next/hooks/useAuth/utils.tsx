export let authReload: (() => void) | undefined = undefined;

export function setAuthReload(v: typeof authReload) {
  authReload = v;
}
