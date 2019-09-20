import ScriptLoader from './script-loader';

describe('ScriptLoader', () => {
    let loader: ScriptLoader;

    beforeEach(() => {
        loader = new ScriptLoader();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('when loading script successfully', () => {
        let script: HTMLScriptElement;

        beforeEach(() => {
            script = document.createElement('script');

            jest.spyOn(document, 'createElement')
                .mockImplementation(() => script);

            jest.spyOn(document.body, 'appendChild')
                .mockImplementation(element =>
                    setTimeout(() => element.onreadystatechange(new Event('readystatechange')), 0)
                );
        });

        it('attaches script tag to document', async () => {
            await loader.loadScript('https://code.jquery.com/jquery-3.2.1.min.js');

            expect(document.body.appendChild)
                .toHaveBeenCalledWith(script);

            expect(script.src)
                .toEqual('https://code.jquery.com/jquery-3.2.1.min.js');
        });

        it('resolves promise if script is loaded', async () => {
            const output = await loader.loadScript('https://code.jquery.com/jquery-3.2.1.min.js');

            expect(output)
                .toBeInstanceOf(Event);
        });

        it('does not load same script twice', async () => {
            await loader.loadScript('https://code.jquery.com/jquery-3.2.1.min.js');
            await loader.loadScript('https://code.jquery.com/jquery-3.2.1.min.js');

            expect(document.body.appendChild)
                .toHaveBeenCalledTimes(1);
        });
    });

    describe('when script fails to load', () => {
        beforeEach(() => {
            jest.spyOn(document.body, 'appendChild')
                .mockImplementation(element =>
                    setTimeout(() => element.onerror(new Event('error')), 0)
                );
        });

        it('rejects promise if script is not loaded', async () => {
            try {
                await loader.loadScript('https://code.jquery.com/jquery-3.2.1.min.js');
            } catch (error) {
                expect(error)
                    .toBeTruthy();
            }
        });

        it('loads the script again', async () => {
            const errorHandler = jest.fn();

            try {
                await loader.loadScript('https://code.jquery.com/jquery-3.2.1.min.js');
            } catch (error) {
                errorHandler(error);
            }

            try {
                await loader.loadScript('https://code.jquery.com/jquery-3.2.1.min.js');
            } catch (error) {
                errorHandler(error);
            }

            expect(document.body.appendChild)
                .toHaveBeenCalledTimes(2);

            expect(errorHandler)
                .toHaveBeenCalledTimes(2);
        });
    });

    describe('when loading multiple scripts', () => {
        let urls: string[];

        beforeEach(() => {
            jest.spyOn(loader, 'preloadScripts')
                .mockReturnValue(Promise.resolve([
                    new Event('load'),
                    new Event('load'),
                ]));

            jest.spyOn(loader, 'loadScript')
                .mockReturnValue(Promise.resolve(new Event('readystatechange')));

            urls = [
                'https://cdn.foobar.com/foo.min.js',
                'https://cdn.foobar.com/bar.min.js',
            ];
        });

        it('preloads scripts in parallel', async () => {
            await loader.loadScripts(urls);

            expect(loader.preloadScripts)
                .toHaveBeenCalledWith(urls);
        });

        it('loads preloaded scripts in sequence', async () => {
            jest.spyOn(loader, 'loadScript')
                .mockReturnValue(Promise.resolve(new Event('readystatechange')));

            await loader.loadScripts(urls);

            expect((loader.loadScript as jest.Mock).mock.calls[0][0])
                .toEqual(urls[0]);

            expect((loader.loadScript as jest.Mock).mock.calls[1][0])
                .toEqual(urls[1]);
        });

        it('returns rejected promise if unable to load one of the scripts', async () => {
            const error = new Error('Unexpected error');

            jest.spyOn(loader, 'loadScript')
                .mockReturnValue(Promise.reject(error));

            try {
                await loader.loadScripts(urls);
            } catch (thrown) {
                expect(thrown)
                    .toEqual(error);
            }
        });
    });

    describe('when preloading script', () => {
        let preloadedScript: HTMLLinkElement;

        beforeEach(() => {
            preloadedScript = document.createElement('link');

            jest.spyOn(document, 'createElement')
                .mockImplementation(() => preloadedScript);

            jest.spyOn(document.head, 'appendChild')
                .mockImplementation(element =>
                    setTimeout(() => element.onload(new Event('load')), 0)
                );
        });

        it('attaches preload link tag to document', async () => {
            await loader.preloadScript('https://cdn.foobar.com/foo.min.js');

            expect(document.head.appendChild)
                .toHaveBeenCalledWith(preloadedScript);

            expect(preloadedScript.rel)
                .toEqual('preload');

            expect(preloadedScript.as)
                .toEqual('script');

            expect(preloadedScript.href)
                .toEqual('https://cdn.foobar.com/foo.min.js');
        });

        it('resolves promise if script is preloaded', async () => {
            const output = await loader.preloadScript('https://cdn.foobar.com/foo.min.js');

            expect(output)
                .toBeInstanceOf(Event);
        });
    });
});
