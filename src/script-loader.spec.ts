import { createRequestSender, RequestSender } from '@bigcommerce/request-sender';

import BrowserSupport from './browser-support';
import ScriptLoader from './script-loader';

describe('ScriptLoader', () => {
    let browserSupport: BrowserSupport;
    let loader: ScriptLoader;
    let requestSender: RequestSender;

    beforeEach(() => {
        browserSupport = new BrowserSupport();
        requestSender = createRequestSender();

        jest.spyOn(browserSupport, 'canSupportRel')
            .mockReturnValue(true);

        jest.spyOn(requestSender, 'get')
            .mockReturnValue(Promise.resolve({} as any));

        loader = new ScriptLoader(
            browserSupport,
            requestSender
        );
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
                .mockImplementation(element => {
                    setTimeout(() => (element as any).onreadystatechange(new Event('readystatechange')), 0);

                    return element;
                });
        });

        it('attaches script tag to document', async () => {
            await loader.loadScript('https://code.jquery.com/jquery-3.2.1.min.js');

            expect(document.body.appendChild)
                .toHaveBeenCalledWith(script);

            expect(script.src)
                .toEqual('https://code.jquery.com/jquery-3.2.1.min.js');
        });

        it('loads script synchronously by default', async () => {
            await loader.loadScript('https://code.jquery.com/jquery-3.2.1.min.js');

            expect(script.async)
                .toEqual(false);
        });

        it('resolves promise if script is loaded', async () => {
            const output = await loader.loadScript('https://code.jquery.com/jquery-3.2.1.min.js');

            expect(output)
                .toBeUndefined();
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
                .mockImplementation(element => {
                    setTimeout(() => (element as HTMLElement).onerror!(new Event('error')), 0);

                    return element;
                });
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
                .mockReturnValue(Promise.resolve());

            jest.spyOn(loader, 'loadScript')
                .mockReturnValue(Promise.resolve());

            urls = [
                'https://cdn.foobar.com/foo.min.js',
                'https://cdn.foobar.com/bar.min.js',
            ];
        });

        it('loads preloaded scripts in sequence', async () => {
            jest.spyOn(loader, 'loadScript')
                .mockReturnValue(Promise.resolve());

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
                .mockImplementation(element => {
                    setTimeout(() => (element as HTMLElement).onload!(new Event('load')), 0);

                    return element;
                });
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

        it('prefetches script if option is provided', async () => {
            await loader.preloadScript('https://cdn.foobar.com/foo.min.js', {
                prefetch: true,
            });

            expect(document.head.appendChild)
                .toHaveBeenCalledWith(preloadedScript);

            expect(preloadedScript.rel)
                .toEqual('prefetch');

            expect(preloadedScript.as)
                .toEqual('script');

            expect(preloadedScript.href)
                .toEqual('https://cdn.foobar.com/foo.min.js');
        });

        it('falls back to using XHR if browser does not support preload', async () => {
            jest.spyOn(browserSupport, 'canSupportRel')
                .mockImplementation(rel => rel === 'preload' ? false : true);

            await loader.preloadScript('https://cdn.foobar.com/foo.min.js');

            expect(requestSender.get)
                .toHaveBeenCalledWith('https://cdn.foobar.com/foo.min.js', {
                    credentials: false,
                    headers: { Accept: 'application/javascript' },
                });
        });

        it('resolves promise if script is preloaded', async () => {
            const output = await loader.preloadScript('https://cdn.foobar.com/foo.min.js');

            expect(output)
                .toBeUndefined();
        });
    });
});
