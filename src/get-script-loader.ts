import createScriptLoader from './create-script-loader';
import ScriptLoader from './script-loader';

let instance: ScriptLoader;

export default function getScriptLoader(): ScriptLoader {
    if (!instance) {
        instance = createScriptLoader();
    }

    return instance;
}
