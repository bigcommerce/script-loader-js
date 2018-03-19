import ScriptLoader from './script-loader';

describe('ScriptLoader', () => {
    let loader: ScriptLoader;
    let script: HTMLScriptElement;

    beforeEach(() => {
        script = document.createElement('script');
        jest.spyOn(document, 'createElement').mockImplementation(() => script);
        loader = new ScriptLoader();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('when script succeeds to load', () => {
        beforeEach(() => {
            jest.spyOn(document.body, 'appendChild').mockImplementation((element) =>
                setTimeout(() => element.onreadystatechange(new Event('readystatechange')), 0)
            );
        });

        it('attaches script tag to document', async () => {
            await loader.loadScript('https://code.jquery.com/jquery-3.2.1.min.js');

            expect(document.body.appendChild).toHaveBeenCalledWith(script);
            expect(script.src).toEqual('https://code.jquery.com/jquery-3.2.1.min.js');
        });

        it('resolves promise if script is loaded', async () => {
            const output = await loader.loadScript('https://code.jquery.com/jquery-3.2.1.min.js');

            expect(output).toBeInstanceOf(Event);
        });

        it('does not load same script twice', async () => {
            await loader.loadScript('https://code.jquery.com/jquery-3.2.1.min.js');
            await loader.loadScript('https://code.jquery.com/jquery-3.2.1.min.js');

            expect(document.body.appendChild).toHaveBeenCalledTimes(1);
        });
    });

    describe('when script fails to load', () => {
        beforeEach(() => {
            jest.spyOn(document.body, 'appendChild').mockImplementation(element =>
                setTimeout(() => element.onerror(new Event('error')), 0)
            );
        });

        it('rejects promise if script is not loaded', async () => {
            await loader.loadScript('https://code.jquery.com/jquery-3.2.1.min.js')
                .catch(error => expect(error).toBeTruthy());
        });

        it('loads the script again', async () => {
            await loader.loadScript('https://code.jquery.com/jquery-3.2.1.min.js')
                .catch(() => {});
            await loader.loadScript('https://code.jquery.com/jquery-3.2.1.min.js')
                .catch(() => {});

            expect(document.body.appendChild).toHaveBeenCalledTimes(2);
        });
    });
});
