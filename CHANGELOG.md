# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.2.2](https://github.com/bigcommerce/script-loader-js/compare/v2.2.1...v2.2.2) (2020-06-23)


### Bug Fixes

* **common:** CHECKOUT-4954 Upgrade request-sender version ([201651b](https://github.com/bigcommerce/script-loader-js/commit/201651b))

### [2.2.1](https://github.com/bigcommerce/script-loader-js/compare/v2.2.0...v2.2.1) (2020-05-25)

## [2.2.0](https://github.com/bigcommerce/script-loader-js/compare/v2.1.0...v2.2.0) (2020-05-25)


### Features

* **core:** CHECKOUT-4909 Pass in attributes to stylesheet ([8bfc8a4](https://github.com/bigcommerce/script-loader-js/commit/8bfc8a4))

## [2.1.0](https://github.com/bigcommerce/script-loader-js/compare/v2.0.0...v2.1.0) (2019-10-24)


### Features

* **common:** PAYPAL-7 Pass in merchant ID on PayPal button script for PayPal Express Checkout ([bdfbcd5](https://github.com/bigcommerce/script-loader-js/commit/bdfbcd5))
* **common:** PAYPAL-7 Pass in merchant ID on PayPal button script for PayPal Express Checkout ([fc9e7c9](https://github.com/bigcommerce/script-loader-js/commit/fc9e7c9))
* **common:** PAYPAL-7 Pass in merchant ID on PayPal button script for PayPal Express Checkout ([b6613e3](https://github.com/bigcommerce/script-loader-js/commit/b6613e3))
* **common:** PAYPAL-7 Pass in merchant ID on PayPal button script for PayPal Express Checkout ([fe07c6e](https://github.com/bigcommerce/script-loader-js/commit/fe07c6e))

## [2.0.0](https://github.com/bigcommerce/script-loader-js/compare/v1.0.0...v2.0.0) (2019-10-03)


### ⚠ BREAKING CHANGES

* **core:** Previously, when a script is loaded, we return the
associated event object inside a promise object to the caller. With this
change, we return an empty promise object instead. This change is
necessary because we can't guarantee that scripts can be loaded in the
same way across different browsers. For example, some browsers don't
support `rel="preload"`, so as a fallback, we have to preload scripts
using regular XHR calls. In that case, we don't have an event object to
return to the caller. We could potentially mock the event object to keep
the return values consistent. But considering it is not a very useful
thing to return, we've decided to make a breaking change and return
nothing instead.

### Bug Fixes

* **core:** CHECKOUT-4455 Provide fallback for browsers that don't support `preload` attribute ([0fc52e7](https://github.com/bigcommerce/script-loader-js/commit/0fc52e7))


* **core:** CHECKOUT-4455 Stop resolving promise with load event ([670fd2c](https://github.com/bigcommerce/script-loader-js/commit/670fd2c))

<a name="1.0.0"></a>
# [1.0.0](https://github.com/bigcommerce/script-loader-js/compare/v0.2.0...v1.0.0) (2019-09-23)


### Features

* **core:** CHECKOUT-4400 Add ability to prefetch scripts and stylesheets ([072d567](https://github.com/bigcommerce/script-loader-js/commit/072d567))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/bigcommerce/script-loader-js/compare/v0.1.6...v0.2.0) (2019-09-20)


### Features

* **common:** CHECKOUT-4400 Add StylesheetLoader for loading stylesheets ([06fd92b](https://github.com/bigcommerce/script-loader-js/commit/06fd92b))
* **common:** CHECKOUT-4400 Load multiple scripts in parallel and run them in series ([4d140a6](https://github.com/bigcommerce/script-loader-js/commit/4d140a6))



<a name="0.1.6"></a>
## [0.1.6](https://github.com/bigcommerce/script-loader-js/compare/v0.1.5...v0.1.6) (2018-08-23)


### Bug Fixes

* **common:** CHECKOUT-3462 Remove Node engine field ([d2fd2f3](https://github.com/bigcommerce/script-loader-js/commit/d2fd2f3))



<a name="0.1.5"></a>
## [0.1.5](https://github.com/bigcommerce/script-loader-js/compare/v0.1.4...v0.1.5) (2018-05-28)


### Bug Fixes

* **common:** CHECKOUT-3191 Fix sourcemaps by enabling `inlineSources` ([1c06351](https://github.com/bigcommerce/script-loader-js/commit/1c06351))



<a name="0.1.4"></a>
## [0.1.4](https://github.com/bigcommerce/script-loader-js/compare/v0.1.3...v0.1.4) (2018-05-14)



<a name="0.1.3"></a>
## [0.1.3](https://github.com/bigcommerce/script-loader-js/compare/v0.1.2...v0.1.3) (2018-05-10)



<a name="0.1.2"></a>
## [0.1.2](https://github.com/bigcommerce/script-loader-js/compare/v0.1.1...v0.1.2) (2018-03-19)


### Bug Fixes

* **core:** CHECKOUT-3012 Do not cache failed responses ([792de4a](https://github.com/bigcommerce/script-loader-js/commit/792de4a))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/bigcommerce/script-loader-js/compare/v0.1.0...v0.1.1) (2018-03-15)


### Bug Fixes

* **core:** CHECKOUT-3012 Avoid loading the same script twice ([871ae47](https://github.com/bigcommerce/script-loader-js/commit/871ae47))



<a name="0.1.0"></a>
# 0.1.0 (2018-02-26)


### Features

* **core:** CHECKOUT-2739 Add `ScriptLoader` responsible for loading JS files asynchronously ([06620da](https://github.com/bigcommerce/script-loader-js/commit/06620da))
