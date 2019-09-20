import getStylesheetLoader from './get-stylesheet-loader';
import StylesheetLoader from './stylesheet-loader';

describe('getStylesheetLoader()', () => {
    it('returns same `StylesheetLoader` instance', () => {
        const loader = getStylesheetLoader();
        const loader2 = getStylesheetLoader();

        expect(loader)
            .toBe(loader2);

        expect(loader)
            .toBeInstanceOf(StylesheetLoader);
    });
});
