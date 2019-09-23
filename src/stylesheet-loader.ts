export interface LoadStylesheetOptions {
    prepend: boolean;
}

export interface PreloadStylesheetOptions {
    prefetch: boolean;
}

export default class StylesheetLoader {
    private _stylesheets: { [key: string]: Promise<Event> } = {};
    private _preloadedStylesheets: { [key: string]: Promise<Event> } = {};

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

    preloadStylesheet(url: string, options?: PreloadStylesheetOptions): Promise<Event> {
        if (!this._preloadedStylesheets[url]) {
            this._preloadedStylesheets[url] = new Promise((resolve, reject) => {
                const preloadedStylesheet = document.createElement('link');
                const { prefetch = false } = options || {};

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
            });
        }

        return this._preloadedStylesheets[url];
    }

    preloadStylesheets(urls: string[], options?: PreloadStylesheetOptions): Promise<Event[]> {
        return Promise.all(urls.map(url => this.preloadStylesheet(url, options)));
    }
}
