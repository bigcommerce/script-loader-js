export default class BrowserSupport {
    canSupportRel(rel: string): boolean {
        const link = document.createElement('link');

        return !!(
            link.relList &&
            link.relList.supports &&
            link.relList.supports(rel)
        );
    }
}
