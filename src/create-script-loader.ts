import { createRequestSender } from '@bigcommerce/request-sender';

import BrowserSupport from './browser-support';
import ScriptLoader from './script-loader';

export default function createScriptLoader(): ScriptLoader {
    return new ScriptLoader(
        new BrowserSupport(),
        createRequestSender()
    );
}
