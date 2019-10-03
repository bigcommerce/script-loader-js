import BrowserSupport from './browser-support';

describe('BrowserSupport', () => {
    let link: HTMLLinkElement;
    let support: BrowserSupport;

    beforeEach(() => {
        const createElement = document.createElement.bind(document);

        link = {
            relList: {
                supports: jest.fn(() => true),
            },
        } as unknown as HTMLLinkElement;

        jest.spyOn(document, 'createElement')
            .mockImplementation(type => {
                return type === 'link' ? link : createElement(type);
            });

        support = new BrowserSupport();
    });

    it('returns true if able to support rel type', () => {
        expect(support.canSupportRel('preload'))
            .toEqual(true);
    });

    it('returns false if unable to support rel type', () => {
        jest.spyOn(link.relList, 'supports')
            .mockReturnValue(false);

        expect(support.canSupportRel('preload'))
            .toEqual(false);
    });

    it('returns false if `relList` is not supported', () => {
        link = {} as unknown as HTMLLinkElement;

        expect(support.canSupportRel('preload'))
            .toEqual(false);
    });
});
