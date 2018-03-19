export default class ScriptLoader {
    private _scripts: { [key: string]: Promise<Event> } = {};

    loadScript(src: string): Promise<Event> {
        if (!this._scripts[src]) {
            this._scripts[src] = new Promise((resolve, reject) => {
                const script = document.createElement('script') as LegacyHTMLScriptElement;

                script.onload = (event) => resolve(event);
                script.onreadystatechange = (event) => resolve(event);
                script.onerror = (event) => {
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
}

interface LegacyHTMLScriptElement extends HTMLScriptElement {
    // `onreadystatechange` is needed to support legacy IE
    onreadystatechange: (this: HTMLElement, event: Event) => any;
}
