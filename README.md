# @bigcommerce/script-loader

[![Build Status](https://travis-ci.com/bigcommerce/script-loader-js.svg?token=pywwZy8zX1F5AzeQ9WpL&branch=master)](https://travis-ci.com/bigcommerce/script-loader-js)

A library for loading JavaScript files asynchronously. It loads script files by injecting script tags into DOM during runtime.

## Install

You can install this library using [npm](https://www.npmjs.com/get-npm).

```sh
npm install --save @bigcommerce/script-loader
```

## Usage

```js
import { createScriptLoader } from '@bigcommerce/script-loader';

const loader = createScriptLoader();

loader.loadScript('https://code.jquery.com/jquery-3.2.1.min.js')
    .then(() => {
        console.log('Loaded!');
    });
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
