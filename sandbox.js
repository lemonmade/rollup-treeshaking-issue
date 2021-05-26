import {createRemoteRoot, retain} from '@remote-ui/core';


const registeredExtensions = new Map();

const clips = Object.freeze({
  extend(extensionPoint, extend) {
    registeredExtensions.set(extensionPoint, extend);
  },
});

Reflect.defineProperty(self, 'clips', {
  value: clips,
  configurable: false,
  enumerable: true,
  writable: false,
});

export function load(script) {
  importScripts(script);
}

export async function render(
  id,
  channel,
  components,
  api,
) {
  retain(channel);
  retain(api);

  const root = createRemoteRoot(channel, {components});

  // TypeScript has a very hard time understanding the various union types going on here :/
  // @ts-ignore
  let result = runExtensionPoint(id, root, api);

  if (typeof result === 'object' && result != null && 'then' in result) {
    result = await result;
  }

  root.mount();
  return result;
}

function runExtensionPoint(
  id,
  ...args
) {
  return registeredExtensions.get(id)(...args);
}
