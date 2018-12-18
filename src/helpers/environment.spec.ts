import Environment from './environment';

describe('username', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV };
        delete process.env['dockerhub.username'];
    });

    afterEach(() => {
        process.env = OLD_ENV;
    });

    test('returns the default username when no username is defined in the environment', () => {
        delete process.env['dockerhub.username'];
        expect(Environment.username).toBeTruthy();
        expect(Environment.username).toBe(Environment.DEFAULT_VALUE);
    });
    test('returns the username set in the environment when one is set', () => {
        const expectedUsername = 'test-username';
        process.env['dockerhub.username'] = expectedUsername;
        expect(Environment.username).toBeTruthy();
        expect(Environment.username).toBe(expectedUsername);
    });
});

describe('password', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV };
        delete process.env['dockerhub.password'];
    });

    afterEach(() => {
        process.env = OLD_ENV;
    });

    test('returns the default password when no password is defined in the environment', () => {
        delete process.env['dockerhub.password'];
        expect(Environment.password).toBeTruthy();
        expect(Environment.password).toBe(Environment.DEFAULT_VALUE);
    });
    test('returns the password set in the environment when one is set', () => {
        const expectedPassword = 'test-password';
        process.env['dockerhub.password'] = expectedPassword;
        expect(Environment.password).toBeTruthy();
        expect(Environment.password).toBe(expectedPassword);
    });
});

describe('organization', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV };
        delete process.env['dockerhub.organization'];
    });

    afterEach(() => {
        process.env = OLD_ENV;
    });

    test('returns the default organization when no organization is defined in the environment', () => {
        delete process.env['dockerhub.organization'];
        expect(Environment.organization).toBeTruthy();
        expect(Environment.organization).toBe(Environment.DEFAULT_VALUE);
    });
    test('returns the organization set in the environment when one is set', () => {
        const expectedOrganization = 'test-organization';
        process.env['dockerhub.organization'] = expectedOrganization;
        expect(Environment.organization).toBeTruthy();
        expect(Environment.organization).toBe(expectedOrganization);
    });
});

describe('image', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV };
        delete process.env['dockerhub.image'];
    });

    afterEach(() => {
        process.env = OLD_ENV;
    });

    test('returns the default image when no image is defined in the environment', () => {
        delete process.env['dockerhub.image'];
        expect(Environment.image).toBeTruthy();
        expect(Environment.image).toBe(Environment.DEFAULT_VALUE);
    });
    test('returns the image set in the environment when one is set', () => {
        const expectedImage = 'test-image';
        process.env['dockerhub.image'] = expectedImage;
        expect(Environment.image).toBeTruthy();
        expect(Environment.image).toBe(expectedImage);
    });
});

describe('images', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV };
        delete process.env['dockerhub.images'];
    });

    afterEach(() => {
        process.env = OLD_ENV;
    });

    test('returns the default images when no images are defined in the environment', () => {
        delete process.env['dockerhub.images'];
        expect(Environment.images).toBeTruthy();
        expect(Environment.images.length).toBe(1);
        expect(Environment.images).toEqual([Environment.DEFAULT_IMAGES]);
    });
    test('returns the array value generated from the images set in the environment when set', () => {
        const configuredImages = 'test-image-a,test-image-b,test-image-c';
        const expectedImages = ['test-image-a', 'test-image-b', 'test-image-c'];
        process.env['dockerhub.images'] = configuredImages;
        expect(Environment.images).toBeTruthy();
        expect(Environment.images.length).toBe(3);
        expect(Environment.images).toEqual(expectedImages);
    });
});

describe('stringMatcherExpression', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV };
        delete process.env['match.expression'];
    });

    afterEach(() => {
        process.env = OLD_ENV;
    });

    test('returns the default expression when no expression is defined in the environment', () => {
        delete process.env['match.expression'];
        expect(Environment.stringMatcherExpression).toBeTruthy();
        expect(Environment.stringMatcherExpression).toBe(Environment.DEFAULT_MATCHER_EXPRESSION);
    });
    test('returns the expression set in the environment when set', () => {
        const expectedExpression = 'sample-.*'
        process.env['match.expression'] = expectedExpression;
        expect(Environment.stringMatcherExpression).toBeTruthy();
        expect(Environment.stringMatcherExpression).toBe(expectedExpression);
    });
});

describe('matcherExpression', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV };
        delete process.env['match.expression'];
    });

    afterEach(() => {
        process.env = OLD_ENV;
    });

    test('returns the default RegExp expression when no expression is defined in the environment', () => {
        delete process.env['match.expression'];
        expect(Environment.matcherExpression).toBeTruthy();
        expect(Environment.matcherExpression).toEqual(new RegExp(Environment.DEFAULT_MATCHER_EXPRESSION));
    });
    test('returns the RegExp expression set in the environment when a string expression is set', () => {
        const configuredExpression = 'sample-.*';
        const expectedExpression = new RegExp(configuredExpression);
        process.env['match.expression'] = configuredExpression;
        expect(Environment.matcherExpression).toBeTruthy();
        expect(Environment.matcherExpression).toEqual(expectedExpression);
    });
});

describe('keep', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV };
        delete process.env['keep'];
    });

    afterEach(() => {
        process.env = OLD_ENV;
    });

    test('returns the default numerical keep value when no keep setting is defined in the environment', () => {
        delete process.env['keep'];
        expect(Environment.keep).toBeTruthy();
        expect(Environment.keep).toBe(parseInt(Environment.DEFAULT_KEEP));
    });
    test('returns the numerical keep value when a valid number is set in the environment', () => {
        const configuredKeep = '7';
        const expectedKeep = 7;
        process.env['keep'] = configuredKeep;
        expect(Environment.keep).toBeTruthy();
        expect(Environment.keep).toBe(expectedKeep);
    });
    test('returns the 1 when a number less than 0 is set in the environment', () => {
        const configuredKeep = '-4';
        const expectedKeep = 1;
        process.env['keep'] = configuredKeep;
        expect(Environment.keep).toBeTruthy();
        expect(Environment.keep).toBe(expectedKeep);
    });
    test('returns the 1 when 0 is set in the environment', () => {
        const configuredKeep = '0';
        const expectedKeep = 1;
        process.env['keep'] = configuredKeep;
        expect(Environment.keep).toBeTruthy();
        expect(Environment.keep).toBe(expectedKeep);
    });
    test('returns the default numerical keep value when a non parseable number or string is set in the environment', () => {
        const configuredKeep = 'invalid-number';
        process.env['keep'] = configuredKeep;
        expect(Environment.keep).toBeTruthy();
        expect(Environment.keep).toBe(parseInt(Environment.DEFAULT_KEEP));
    });
});