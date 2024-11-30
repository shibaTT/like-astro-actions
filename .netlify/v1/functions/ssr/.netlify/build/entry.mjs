import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_DZK1m67M.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const _page0 = () => import('./pages/_actions/_---path_.astro.mjs');
const _page1 = () => import('./pages/_image.astro.mjs');
const _page2 = () => import('./pages/blog/_id_.astro.mjs');
const _page3 = () => import('./pages/error.astro.mjs');
const _page4 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/.pnpm/astro@4.16.16_@types+node@20.17.9_rollup@4.27.4_typescript@5.7.2/node_modules/astro/dist/actions/runtime/route.js", _page0],
    ["node_modules/.pnpm/astro@4.16.16_@types+node@20.17.9_rollup@4.27.4_typescript@5.7.2/node_modules/astro/dist/assets/endpoint/generic.js", _page1],
    ["src/pages/blog/[id].astro", _page2],
    ["src/pages/error.astro", _page3],
    ["src/pages/index.astro", _page4]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "50cb78da-bc71-4073-9c45-3e0850ee0606"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
