"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ScriptLoader = (function () {
    function ScriptLoader() {
        this._scripts = {};
    }
    ScriptLoader.prototype.loadScript = function (src) {
        var _this = this;
        if (!this._scripts[src]) {
            this._scripts[src] = new Promise(function (resolve, reject) {
                var script = document.createElement('script');
                script.onload = function (event) { return resolve(event); };
                script.onreadystatechange = function (event) { return resolve(event); };
                script.onerror = function (event) {
                    delete _this._scripts[src];
                    reject(event);
                };
                script.async = true;
                script.src = src;
                document.body.appendChild(script);
            });
        }
        return this._scripts[src];
    };
    return ScriptLoader;
}());
exports.default = ScriptLoader;
//# sourceMappingURL=script-loader.js.map