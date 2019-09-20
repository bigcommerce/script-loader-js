import StylesheetLoader from './stylesheet-loader';

describe('StylesheetLoader', () => {
    let loader: StylesheetLoader;
    let stylesheet: HTMLLinkElement;

    beforeEach(() => {
        stylesheet = document.createElement('link');

        jest.spyOn(document, 'createElement')
            .mockImplementation(() => stylesheet);

        loader = new StylesheetLoader();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('when stylesheet loads successfully', () => {
        beforeEach(() => {
            jest.spyOn(document.head, 'appendChild')
                .mockImplementation(element =>
                    setTimeout(() => element.onload(new Event('load')), 0)
                );
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
                .toBeInstanceOf(Event);
        });

        it('does not load same stylesheet twice', async () => {
            await loader.loadStylesheet('https://foo.bar/hello-world.css');
            await loader.loadStylesheet('https://foo.bar/hello-world.css');

            expect(document.head.appendChild)
                .toHaveBeenCalledTimes(1);
        });
    });

    describe('when stylesheet fails to load', () => {
        beforeEach(() => {
            jest.spyOn(document.head, 'appendChild')
                .mockImplementation(element =>
                    setTimeout(() => element.onerror(new Event('error')), 0)
                );
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
});
