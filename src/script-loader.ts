import { RequestSender } from '@bigcommerce/request-sender';

import BrowserSupport from './browser-support';

export interface LoadScriptOptions {
    async: boolean;
}

export interface PreloadScriptOptions {
    prefetch: boolean;
}

export interface ScriptAttributes {
    [key: string]: string;
}

export default class ScriptLoader {
    private _scripts: { [key: string]: Promise<void> } = {};
    private _preloadedScripts: { [key: string]: Promise<void> } = {};

    /**
     * @internal
     */
    constructor(
        private _browserSupport: BrowserSupport,
        private _requestSender: RequestSender
    ) {}

    loadScript(src: string, options?: LoadScriptOptions, scriptAttributes?: ScriptAttributes): Promise<void> {
        if (!this._scripts[src]) {
            this._scripts[src] = new Promise((resolve, reject) => {
                const script = document.createElement('script') as LegacyHTMLScriptElement;
                const { async = false } = options || {};

                for (const key in scriptAttributes) {
                    if (scriptAttributes.hasOwnProperty(key)) {
                        script.setAttribute(key, scriptAttributes[key]);
                    }
                }

                script.onload = () => resolve();
                script.onreadystatechange = () => resolve();
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

    loadScripts(urls: string[], options?: LoadScriptOptions): Promise<void> {
        return Promise.all(urls.map(url => this.loadScript(url, options)))
            .then(() => undefined);
    }

    preloadScript(url: string, options?: PreloadScriptOptions): Promise<void> {
        if (!this._preloadedScripts[url]) {
            this._preloadedScripts[url] = new Promise((resolve, reject) => {
                const { prefetch = false } = options || {};
                const rel = prefetch ? 'prefetch' : 'preload';

                if (this._browserSupport.canSupportRel(rel)) {
                    const preloadedScript = document.createElement('link');

                    preloadedScript.as = 'script';
                    preloadedScript.rel = rel;
                    preloadedScript.href = url;

                    preloadedScript.onload = () => {
                        resolve();
                    };

                    preloadedScript.onerror = () => {
                        delete this._preloadedScripts[url];
                        reject();
                    };

                    document.head.appendChild(preloadedScript);
                } else {
                    this._requestSender.get(url, {
                        credentials: false,
                        headers: { Accept: 'application/javascript' },
                    })
                        .then(() => resolve())
                        .catch(reject);
                }
            });
        }

        return this._preloadedScripts[url];
    }

    preloadScripts(urls: string[], options?: PreloadScriptOptions): Promise<void> {
        return Promise.all(urls.map(url => this.preloadScript(url, options)))
            .then(() => undefined);
    }
}

interface LegacyHTMLScriptElement extends HTMLScriptElement {
    // `onreadystatechange` is needed to support legacy IE
    onreadystatechange(this: HTMLElement, event: Event): any;
}
