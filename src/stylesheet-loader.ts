import { RequestSender, Response } from '@bigcommerce/request-sender';

import BrowserSupport from './browser-support';

export interface LoadStylesheetOptions {
    prepend: boolean;
}

export interface PreloadStylesheetOptions {
    prefetch: boolean;
}

export default class StylesheetLoader {
    private _stylesheets: { [key: string]: Promise<Event> } = {};
    private _preloadedStylesheets: { [key: string]: Promise<Event | Response> } = {};

    /**
     * @internal
     */
    constructor(
        private _browserSupport: BrowserSupport,
        private _requestSender: RequestSender
    ) {}

    loadStylesheet(src: string, options?: LoadStylesheetOptions): Promise<Event> {
        if (!this._stylesheets[src]) {
            this._stylesheets[src] = new Promise((resolve, reject) => {
                const stylesheet = document.createElement('link');
                const { prepend = false } = options || {};

                stylesheet.onload = event => resolve(event);
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

    loadStylesheets(urls: string[], options?: LoadStylesheetOptions): Promise<Event[]> {
        return Promise.all(urls.map(url => this.loadStylesheet(url, options)));
    }

    preloadStylesheet(url: string, options?: PreloadStylesheetOptions): Promise<Event | Response> {
        if (!this._preloadedStylesheets[url]) {
            this._preloadedStylesheets[url] = new Promise((resolve, reject) => {
                const { prefetch = false } = options || {};
                const rel = prefetch ? 'prefetch' : 'preload';

                if (this._browserSupport.canSupportRel(rel)) {
                    const preloadedStylesheet = document.createElement('link');

                    preloadedStylesheet.as = 'style';
                    preloadedStylesheet.rel = prefetch ? 'prefetch' : 'preload';
                    preloadedStylesheet.href = url;

                    preloadedStylesheet.onload = event => {
                        resolve(event);
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
                        .then(resolve)
                        .catch(reject);
                }
            });
        }

        return this._preloadedStylesheets[url];
    }

    preloadStylesheets(urls: string[], options?: PreloadStylesheetOptions): Promise<Array<Event | Response>> {
        return Promise.all(urls.map(url => this.preloadStylesheet(url, options)));
    }
}
