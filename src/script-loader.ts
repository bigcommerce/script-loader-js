import { RequestSender, Response } from '@bigcommerce/request-sender';

import BrowserSupport from './browser-support';

export interface LoadScriptOptions {
    async: boolean;
}

export interface PreloadScriptOptions {
    prefetch: boolean;
}

export default class ScriptLoader {
    private _scripts: { [key: string]: Promise<Event> } = {};
    private _preloadedScripts: { [key: string]: Promise<Event | Response> } = {};

    /**
     * @internal
     */
    constructor(
        private _browserSupport: BrowserSupport,
        private _requestSender: RequestSender
    ) {}

    loadScript(src: string, options?: LoadScriptOptions): Promise<Event> {
        if (!this._scripts[src]) {
            this._scripts[src] = new Promise((resolve, reject) => {
                const script = document.createElement('script') as LegacyHTMLScriptElement;
                const { async = false } = options || {};

                script.onload = event => resolve(event);
                script.onreadystatechange = event => resolve(event);
                script.onerror = event => {
                    delete this._scripts[src];
                    reject(event);
                };
                script.async = async;
                script.src = src;

                document.body.appendChild(script);
            });
        }

        return this._scripts[src];
    }

    loadScripts(urls: string[], options?: LoadScriptOptions): Promise<Event[]> {
        return Promise.all(urls.map(url => this.loadScript(url, options)));
    }

    preloadScript(url: string, options?: PreloadScriptOptions): Promise<Event | Response> {
        if (!this._preloadedScripts[url]) {
            this._preloadedScripts[url] = new Promise((resolve, reject) => {
                const { prefetch = false } = options || {};
                const rel = prefetch ? 'prefetch' : 'preload';

                if (this._browserSupport.canSupportRel(rel)) {
                    const preloadedScript = document.createElement('link');

                    preloadedScript.as = 'script';
                    preloadedScript.rel = rel;
                    preloadedScript.href = url;

                    preloadedScript.onload = event => {
                        resolve(event);
                    };

                    preloadedScript.onerror = event => {
                        delete this._preloadedScripts[url];
                        reject(event);
                    };

                    document.head.appendChild(preloadedScript);
                } else {
                    this._requestSender.get(url, {
                        credentials: false,
                        headers: { Accept: 'application/javascript' },
                    })
                        .then(resolve)
                        .catch(reject);
                }
            });
        }

        return this._preloadedScripts[url];
    }

    preloadScripts(urls: string[], options?: PreloadScriptOptions): Promise<Array<Event | Response>> {
        return Promise.all(urls.map(url => this.preloadScript(url, options)));
    }
}

interface LegacyHTMLScriptElement extends HTMLScriptElement {
    // `onreadystatechange` is needed to support legacy IE
    onreadystatechange(this: HTMLElement, event: Event): any;
}
