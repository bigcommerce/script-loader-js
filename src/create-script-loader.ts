import ScriptLoader from './script-loader';

export default function createScriptLoader(): ScriptLoader {
    return new ScriptLoader(document);
}
