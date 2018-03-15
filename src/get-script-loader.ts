import ScriptLoader from './script-loader';
import createScriptLoader from './create-script-loader';

let instance: ScriptLoader;

export default function getScriptLoader(): ScriptLoader {
    if (!instance) {
        instance = createScriptLoader();
    }

    return instance;
}
