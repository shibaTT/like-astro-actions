import { A as AstroError, f as ActionNotFoundError } from './astro/assets-service_if9FHJvC.mjs';

const ACTION_API_CONTEXT_SYMBOL = Symbol.for("astro.actionAPIContext");
const formContentTypes = ["application/x-www-form-urlencoded", "multipart/form-data"];
function hasContentType(contentType, expected) {
  const type = contentType.split(";")[0].toLowerCase();
  return expected.some((t) => type === t);
}
function isActionAPIContext(ctx) {
  const symbol = Reflect.get(ctx, ACTION_API_CONTEXT_SYMBOL);
  return symbol === true;
}

async function getAction(path) {
  const pathKeys = path.replace(/^.*\/_actions\//, "").split(".").map((key) => decodeURIComponent(key));
  let { server: actionLookup } = await import('./_astro_internal-actions_CXCwdvFB.mjs');
  if (actionLookup == null || !(typeof actionLookup === "object")) {
    throw new TypeError(
      `Expected \`server\` export in actions file to be an object. Received ${typeof actionLookup}.`
    );
  }
  for (const key of pathKeys) {
    if (!(key in actionLookup)) {
      throw new AstroError({
        ...ActionNotFoundError,
        message: ActionNotFoundError.message(pathKeys.join("."))
      });
    }
    actionLookup = actionLookup[key];
  }
  if (typeof actionLookup !== "function") {
    throw new TypeError(
      `Expected handler for action ${pathKeys.join(".")} to be a function. Received ${typeof actionLookup}.`
    );
  }
  return actionLookup;
}

const getAction$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  getAction
}, Symbol.toStringTag, { value: 'Module' }));

export { ACTION_API_CONTEXT_SYMBOL as A, getAction$1 as a, formContentTypes as f, getAction as g, hasContentType as h, isActionAPIContext as i };
