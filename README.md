# @bigcommerce/script-loader

[![Build Status](https://travis-ci.com/bigcommerce/script-loader-js.svg?token=pywwZy8zX1F5AzeQ9WpL&branch=master)](https://travis-ci.com/bigcommerce/script-loader-js)

A library for loading JavaScript files asynchronously. It loads script files by injecting script tags into DOM during runtime.

## Install

You can install this library using [npm](https://www.npmjs.com/get-npm).

```sh
npm install --save @bigcommerce/script-loader
```

## Usage

### For scripts

To load a single script:

```js
import { createScriptLoader } from '@bigcommerce/script-loader';

const loader = createScriptLoader();

loader.loadScript('https://cdn.foo.bar/main.js')
    .then(() => {
        console.log('Loaded!');
    });
```

To load multiple scripts:

```js
loader.loadScripts([
    'https://cdn.foo.bar/vendor.js',
    'https://cdn.foo.bar/main.js',
]);
```

To load a script with `async` attribute:

```js
loader.loadScript('https://cdn.foo.bar/main.js', { async: true });
```

To preload or prefetch a script:

```js
loader.preloadScript('https://cdn.foo.bar/chunk.js');
loader.preloadScript('https://cdn.foo.bar/another-chunk.js', { prefetch: true });
```

A prefetched script is a low priority resource, therefore it will be downloaded in the background when the browser is idle. On the other hand, a script without `prefetch` option will be marked as a high priority resource and downloaded immediately. 

Please note that the preloaded or prefetched script won't be executed. It will just be downloaded to the browser cache. To attach it to the document and execute it, you will need to call `loadScript` with the same URL.

To preload or prefetch multiple scripts:

```js
loader.preloadScripts([
    'https://cdn.foo.bar/chunk.js',
    'https://cdn.foo.bar/another-chunk.js',
]);

loader.preloadScripts([
    'https://cdn.foo.bar/chunk.js',
    'https://cdn.foo.bar/another-chunk.js',
], { prefetch: true });
```

For browsers that don't have the ability to `preload` or `prefetch` resources, scripts will be loaded using regular Ajax requests instead.

### For stylesheets

To load a single stylesheet:

```js
import { createStylesheetLoader } from '@bigcommerce/script-loader';

const loader = createStylesheetLoader();

loader.loadStylesheet('https://cdn.foo.bar/main.css')
    .then(() => {
        console.log('Loaded!');
    });
```

To load multiple stylesheets:

```js
loader.loadStylesheet([
    'https://cdn.foo.bar/vendor.css',
    'https://cdn.foo.bar/main.css',
]);
```

To prepend, instead of append, a stylesheet to the head of a document:

```js
loader.loadStylesheet('https://cdn.foo.bar/main.css', { prepend: true });
```

To preload or prefetch a stylesheet:

```js
loader.preloadStylesheet('https://cdn.foo.bar/chunk.css');
loader.preloadStylesheet('https://cdn.foo.bar/another-chunk.css', { prefetch: true });
```

Similar to a preloaded script, a preloaded or prefetched stylesheet won't take an effect until it is attached to the document. To do it, you will need to call `loadStylesheet` with the same URL.

```js
loader.preloadStylesheets([
    'https://cdn.foo.bar/chunk.css',
    'https://cdn.foo.bar/another-chunk.css',
]);

loader.preloadStylesheets([
    'https://cdn.foo.bar/chunk.css',
    'https://cdn.foo.bar/another-chunk.css',
], { prefetch: true });
```

## Contribution

To release:

```sh
npm run release
```

To see other available commands:

```sh
npm run
```

## License

MIT
