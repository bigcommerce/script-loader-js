import { createRequestSender, RequestSender } from '@bigcommerce/request-sender';

import BrowserSupport from './browser-support';
import StylesheetLoader from './stylesheet-loader';

describe('StylesheetLoader', () => {
    let browserSupport: BrowserSupport;
    let loader: StylesheetLoader;
    let requestSender: RequestSender;
    let stylesheet: HTMLLinkElement;

    beforeEach(() => {
        browserSupport = new BrowserSupport();
        requestSender = createRequestSender();
        stylesheet = document.createElement('link');

        jest.spyOn(browserSupport, 'canSupportRel')
            .mockReturnValue(true);

        jest.spyOn(requestSender, 'get')
            .mockReturnValue(Promise.resolve({} as any));

        jest.spyOn(document, 'createElement')
            .mockImplementation(() => stylesheet);

        loader = new StylesheetLoader(
            browserSupport,
            requestSender
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('when stylesheet loads successfully', () => {
        beforeEach(() => {
            jest.spyOn(document.head, 'appendChild')
                .mockImplementation(element => {
                    setTimeout(() => (element as HTMLElement).onload!(new Event('load')), 0);

                    return element;
                });
        });

        it('attaches link tag to document', async () => {
            await loader.loadStylesheet('https://foo.bar/hello-world.css');

            expect(document.head.appendChild)
                .toHaveBeenCalledWith(stylesheet);

            expect(stylesheet.href)
                .toEqual('https://foo.bar/hello-world.css');
        });

        it('resolves promise if stylesheet is loaded', async () => {
            const output = await loader.loadStylesheet('https://foo.bar/hello-world.css');

            expect(output)
                .toBeUndefined();
        });

        it('does not load same stylesheet twice', async () => {
            await loader.loadStylesheet('https://foo.bar/hello-world.css');
            await loader.loadStylesheet('https://foo.bar/hello-world.css');

            expect(document.head.appendChild)
                .toHaveBeenCalledTimes(1);
        });

        it('attaches stylesheet tag to document with data attributes', async () => {
            await loader.loadStylesheet(
                'https://foo.bar/hello-world.css',
                {prepend: true, attributes: {'data-attribute1': '1', 'data-attribute2': '2'}});

            expect(stylesheet.attributes.getNamedItem('data-attribute1')!.value)
                .toEqual('1');

            expect(stylesheet.attributes.getNamedItem('data-attribute2')!.value)
                .toEqual('2');
        });
    });

    describe('when stylesheet fails to load', () => {
        beforeEach(() => {
            jest.spyOn(document.head, 'appendChild')
                .mockImplementation(element => {
                    setTimeout(() => (element as HTMLElement).onerror!(new Event('error')), 0);

                    return element;
                });
        });

        it('rejects promise if stylesheet is not loaded', async () => {
            await loader.loadStylesheet('https://foo.bar/hello-world.css')
                .catch(error =>
                    expect(error)
                        .toBeTruthy()
                );
        });

        it('loads the script again', async () => {
            const errorHandler = jest.fn();

            await loader.loadStylesheet('https://foo.bar/hello-world.css')
                .catch(errorHandler);

            await loader.loadStylesheet('https://foo.bar/hello-world.css')
                .catch(errorHandler);

            expect(document.head.appendChild)
                .toHaveBeenCalledTimes(2);

            expect(errorHandler)
                .toHaveBeenCalledTimes(2);
        });
    });

    describe('when preloading stylesheet', () => {
        let preloadedStylesheet: HTMLLinkElement;

        beforeEach(() => {
            preloadedStylesheet = document.createElement('link');

            jest.spyOn(document, 'createElement')
                .mockImplementation(() => preloadedStylesheet);

            jest.spyOn(document.head, 'appendChild')
                .mockImplementation(element => {
                    setTimeout(() => (element as HTMLElement).onload!(new Event('load')), 0);

                    return element;
                });
        });

        it('attaches preload link tag to document', async () => {
            await loader.preloadStylesheet('https://foo.bar/hello-world.css');

            expect(document.head.appendChild)
                .toHaveBeenCalledWith(preloadedStylesheet);

            expect(preloadedStylesheet.rel)
                .toEqual('preload');

            expect(preloadedStylesheet.as)
                .toEqual('style');

            expect(preloadedStylesheet.href)
                .toEqual('https://foo.bar/hello-world.css');
        });

        it('prefetches stylesheet if option is provided', async () => {
            await loader.preloadStylesheet('https://foo.bar/hello-world.css', {
                prefetch: true,
            });

            expect(document.head.appendChild)
                .toHaveBeenCalledWith(preloadedStylesheet);

            expect(preloadedStylesheet.rel)
                .toEqual('prefetch');

            expect(preloadedStylesheet.as)
                .toEqual('style');

            expect(preloadedStylesheet.href)
                .toEqual('https://foo.bar/hello-world.css');
        });

        it('falls back to using XHR if browser does not support preload', async () => {
            jest.spyOn(browserSupport, 'canSupportRel')
                .mockImplementation(rel => rel === 'preload' ? false : true);

            await loader.preloadStylesheet('https://foo.bar/hello-world.css');

            expect(requestSender.get)
                .toHaveBeenCalledWith('https://foo.bar/hello-world.css', {
                    credentials: false,
                    headers: { Accept: 'text/css' },
                });
        });

        it('resolves promise if stylesheet is preloaded', async () => {
            const output = await loader.preloadStylesheet('https://foo.bar/hello-world.css');

            expect(output)
                .toBeUndefined();
        });
    });
});
