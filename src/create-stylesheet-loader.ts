import { createRequestSender } from '@bigcommerce/request-sender';

import BrowserSupport from './browser-support';
import StylesheetLoader from './stylesheet-loader';

export default function createStylesheetLoader(): StylesheetLoader {
    return new StylesheetLoader(
        new BrowserSupport(),
        createRequestSender()
    );
}
