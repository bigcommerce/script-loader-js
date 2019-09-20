import createStylesheetLoader from './create-stylesheet-loader';
import StylesheetLoader from './stylesheet-loader';

let instance: StylesheetLoader;

export default function getStylesheetLoader(): StylesheetLoader {
    if (!instance) {
        instance = createStylesheetLoader();
    }

    return instance;
}
