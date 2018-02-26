export default class ScriptLoader {
    private _document;
    constructor(_document: Document);
    loadScript(src: string): Promise<Event>;
}
