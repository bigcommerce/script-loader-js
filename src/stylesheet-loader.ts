import { RequestSender } from '@bigcommerce/request-sender';

import BrowserSupport from './browser-support';

export interface LoadStylesheetOptions {
    prepend: boolean;
    attributes?: StylesheetAttributes;
}

export interface PreloadStylesheetOptions {
    prefetch: boolean;
}

export interface StylesheetAttributes {
    [key: string]: string;
}

export default class StylesheetLoader {
    private _stylesheets: { [key: string]: Promise<void> } = {};
    private _preloadedStylesheets: { [key: string]: Promise<void> } = {};

    /**
     * @internal
     */
    constructor(
        private _browserSupport: BrowserSupport,
        private _requestSender: RequestSender
    ) {}

    loadStylesheet(src: string, options?: LoadStylesheetOptions): Promise<void> {
        if (!this._stylesheets[src]) {
            this._stylesheets[src] = new Promise((resolve, reject) => {
                const stylesheet = document.createElement('link');
                const { prepend = false, attributes = {} } = options || {};

                Object.keys(attributes)
                    .forEach(key => {
                        stylesheet.setAttribute(key, attributes[key]);
                    });

                stylesheet.onload = () => resolve();
                stylesheet.onerror = event => {
                    delete this._stylesheets[src];
                    reject(event);
                };
                stylesheet.rel = 'stylesheet';
                stylesheet.href = src;

                if (prepend && document.head.children[0]) {
                    document.head.insertBefore(stylesheet, document.head.children[0]);
                } else {
                    document.head.appendChild(stylesheet);
                }
            });
        }

        return this._stylesheets[src];
    }

    loadStylesheets(urls: string[], options?: LoadStylesheetOptions): Promise<void> {
        return Promise.all(urls.map(url => this.loadStylesheet(url, options)))
            .then(() => undefined);
    }

    preloadStylesheet(url: string, options?: PreloadStylesheetOptions): Promise<void> {
        if (!this._preloadedStylesheets[url]) {
            this._preloadedStylesheets[url] = new Promise((resolve, reject) => {
                const { prefetch = false } = options || {};
                const rel = prefetch ? 'prefetch' : 'preload';

                if (this._browserSupport.canSupportRel(rel)) {
                    const preloadedStylesheet = document.createElement('link');

                    preloadedStylesheet.as = 'style';
                    preloadedStylesheet.rel = prefetch ? 'prefetch' : 'preload';
                    preloadedStylesheet.href = url;

                    preloadedStylesheet.onload = () => {
                        resolve();
                    };

                    preloadedStylesheet.onerror = event => {
                        delete this._preloadedStylesheets[url];
                        reject(event);
                    };

                    document.head.appendChild(preloadedStylesheet);
                } else {
                    this._requestSender.get(url, {
                        credentials: false,
                        headers: { Accept: 'text/css' },
                    })
                        .then(() => resolve())
                        .catch(reject);
                }
            });
        }

        return this._preloadedStylesheets[url];
    }

    preloadStylesheets(urls: string[], options?: PreloadStylesheetOptions): Promise<void> {
        return Promise.all(urls.map(url => this.preloadStylesheet(url, options)))
            .then(() => undefined);
    }
}
