import getScriptLoader from './get-script-loader';
import ScriptLoader from './script-loader';

describe('getScriptLoader()', () => {
    it('returns same `ScriptLoader` instance', () => {
        const loader = getScriptLoader();
        const loader2 = getScriptLoader();

        expect(loader).toBe(loader2);
        expect(loader).toBeInstanceOf(ScriptLoader);
    });
});
