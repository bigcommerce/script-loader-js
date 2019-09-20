export interface LoadStylesheetOptions {
    prepend: boolean;
}

export default class StylesheetLoader {
    private _stylesheets: { [key: string]: Promise<Event> } = {};

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
}
