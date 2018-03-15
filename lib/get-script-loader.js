"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var create_script_loader_1 = require("./create-script-loader");
var instance;
function getScriptLoader() {
    if (!instance) {
        instance = create_script_loader_1.default();
    }
    return instance;
}
exports.default = getScriptLoader;
//# sourceMappingURL=get-script-loader.js.map