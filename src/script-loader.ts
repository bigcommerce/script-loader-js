export interface PreloadScriptOptions {
    prefetch: boolean;
}

export default class ScriptLoader {
    private _scripts: { [key: string]: Promise<Event> } = {};
    private _preloadedScripts: { [key: string]: Promise<Event> } = {};

    loadScript(src: string): Promise<Event> {
        if (!this._scripts[src]) {
            this._scripts[src] = new Promise((resolve, reject) => {
                const script = document.createElement('script') as LegacyHTMLScriptElement;

                script.onload = event => resolve(event);
                script.onreadystatechange = event => resolve(event);
                script.onerror = event => {
                    delete this._scripts[src];
                    reject(event);
                };
                script.async = true;
                script.src = src;

                document.body.appendChild(script);
            });
        }

        return this._scripts[src];
    }

    loadScripts(urls: string[]): Promise<Event[]> {
        const events: Event[] = [];
        let promise: Promise<Event> | undefined;

        return this.preloadScripts(urls)
            .then(() => {
                urls.forEach(url => {
                    if (promise) {
                        promise = promise.then(() => this.loadScript(url));
                    } else {
                        promise = this.loadScript(url);
                    }

                    promise = promise.then(event => {
                        events.push(event);

                        return event;
                    });
                });

                return promise;
            })
            .then(() => events);
    }

    preloadScript(url: string, options?: PreloadScriptOptions): Promise<Event> {
        if (!this._preloadedScripts[url]) {
            this._preloadedScripts[url] = new Promise((resolve, reject) => {
                const preloadedScript = document.createElement('link');
                const { prefetch = false } = options || {};

                preloadedScript.as = 'script';
                preloadedScript.rel = prefetch ? 'prefetch' : 'preload';
                preloadedScript.href = url;

                preloadedScript.onload = event => {
                    resolve(event);
                };

                preloadedScript.onerror = event => {
                    delete this._preloadedScripts[url];
                    reject(event);
                };

                document.head.appendChild(preloadedScript);
            });
        }

        return this._preloadedScripts[url];
    }

    preloadScripts(urls: string[], options?: PreloadScriptOptions): Promise<Event[]> {
        return Promise.all(urls.map(url => this.preloadScript(url, options)));
    }
}

interface LegacyHTMLScriptElement extends HTMLScriptElement {
    // `onreadystatechange` is needed to support legacy IE
    onreadystatechange(this: HTMLElement, event: Event): any;
}
