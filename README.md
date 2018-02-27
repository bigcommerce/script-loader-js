# @bigcommerce/script-loader

[![Build Status](https://travis-ci.com/bigcommerce/script-loader-js.svg?token=pywwZy8zX1F5AzeQ9WpL&branch=master)](https://travis-ci.com/bigcommerce/script-loader-js)

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
yarn release
```

To see other available commands:

```sh
yarn run
```

## License

MIT (Pending)
