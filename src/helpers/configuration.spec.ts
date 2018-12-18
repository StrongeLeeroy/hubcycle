import { validateConfig, validImageName, validMatch, validKeep, getVerboseConfiguration, getNumericKeep } from './configuration';

describe('validKeep', () => {
    test('returns true when a valid "keep" (undefined, integer or parseable string) is given', () => {
        expect(validKeep()).toBeTruthy();
        expect(validKeep(undefined)).toBeTruthy();
        expect(validKeep(5)).toBeTruthy();
        expect(validKeep('15')).toBeTruthy();
        expect(validKeep(55)).toBeTruthy();
    });
    test('returns false when an invalid "keep" is given', () => {
        expect(validKeep(5.64)).toBeFalsy();
        expect(validKeep('5.64')).toBeFalsy();
        expect(validKeep('hello')).toBeFalsy();
        expect(validKeep(true)).toBeFalsy();
        expect(validKeep(false)).toBeFalsy();
    });
});

describe('validImageName', () => {
    test('returns true when a valid image name is given', () => {
        expect(validImageName('strongeleeroy/hubcycle')).toBeTruthy();
        expect(validImageName('hubcycle')).toBeTruthy();
        expect(validImageName('stronge-leeroy/hubcycle')).toBeTruthy();
        expect(validImageName('stronge-leeroy/hub_cycle')).toBeTruthy();
        expect(validImageName('stronge.leeroy/hubcycle')).toBeTruthy();
        expect(validImageName('stronge__leeroy/hubcycle')).toBeTruthy();
        expect(validImageName('stronge-leeroy/hub.cycle')).toBeTruthy();
        expect(validImageName('s__trongeleeroy/hu.b--cycle')).toBeTruthy();
    });
    test('returns false when an invalid image name is given', () => {
        expect(validImageName('strongeleeroy1/hubcycle')).toBeFalsy();
        expect(validImageName('strongeleeroy/hub___cycle')).toBeFalsy();
        expect(validImageName('gher@nandez/hubcycle')).toBeFalsy();
        expect(validImageName('hubcycle-')).toBeFalsy();
        expect(validImageName('_strongeleeroy/hubcycle')).toBeFalsy();
    });
});

describe('validMatch', () => {
    test('returns true when given a string that can be turned into a regular expresion', () => {
        expect(validMatch('develop-.*')).toBeTruthy();
        expect(validMatch('d[a-z]*-.+')).toBeTruthy();
        expect(validMatch('master-[A-z0-9]*-.*')).toBeTruthy();
        expect(validMatch('[A-z0-9]{5-10}')).toBeTruthy();
    });
    test('returns false when given a string that cannot be turned into a regular expresion', () => {
        expect(validMatch('[')).toBeFalsy();
        expect(validMatch('09dsa((]')).toBeFalsy();
        expect(validMatch(')123')).toBeFalsy();
    });
    test('returns true when given a valid complex object matcher', () => {

        expect(
            validMatch([
                { expression: 'develop-.*', keep: 5 },
                { expression: 'd[a-z]*-.+', keep: 5 },
                { expression: 'master-[A-z0-9]*-.*', keep: 5 }
            ])
        ).toBeTruthy();

        expect(
            validMatch([
                { expression: 'develop-.*' },
                { expression: 'd[a-z]*-.+' },
                { expression: 'master-[A-z0-9]*-.*' }
            ])
        ).toBeTruthy();

        expect(
            validMatch([
                { expression: 'develop-.*', keep: '5' },
                { expression: 'd[a-z]*-.+', keep: '5' },
                { expression: 'master-[A-z0-9]*-.*', keep: '5' }
            ])
        ).toBeTruthy();
        
    });
    test('returns false when given an invalid complex object matcher', () => {
        expect(
            validMatch([
                { expression: 'develop-.*', keep: 5 },
                { expression: '[', keep: 5 },
                { expression: 'master-[A-z0-9]*-.*', keep: 5 }
            ])
        ).toBeFalsy();

        expect(
            validMatch([
                { expression: 'develop-.*' },
                { expression: 'd[a-z]*-.+', keep: 5 },
                { expression: ')123' }
            ])
        ).toBeFalsy();

        expect(
            validMatch([
                { expression: 'develop-.*', keep: '5.56' },
                { expression: 'd[a-z]*-.+', keep: '5' },
                { expression: 'master-[A-z0-9]*-.*', keep: '5' }
            ])
        ).toBeFalsy();

        expect(
            validMatch([
                { expression: 'develop-.*', keep: '5' },
                { expression: 'd[a-z]*-.+', keep: '5' },
                { expression: 'master-[A-z0-9]*-.*', keep: 5.65 }
            ])
        ).toBeFalsy();

        expect(
            validMatch([
                { expression: 'develop-.*' },
                { expression: 'd[a-z]*-.+', keep: 'hello' },
                { expression: 'master-[A-z0-9]*-.*', keep: 5.65 }
            ])
        ).toBeFalsy();

    });
});

describe('getNumericKeep', () => {
    test('returns a single integer when given a single (and valid) option', () => {
        expect(getNumericKeep('5')).toBe(5);
        expect(getNumericKeep(10)).toBe(10);
        expect(getNumericKeep('10')).toBe(10);
        expect(getNumericKeep(150)).toBe(150);
    });

    test('returns a single integer when given multiple (and valid) options', () => {
        expect(getNumericKeep('10', 5, 15)).toBe(10);
        expect(getNumericKeep(10, '156', 6)).toBe(10);
        expect(getNumericKeep(1, 10, '6')).toBe(1);
        expect(getNumericKeep('150', 160)).toBe(150);
    });

    test('returns a single integer when given both invalid and at least one valid option', () => {
        expect(getNumericKeep('seven', undefined, '10', undefined)).toBe(10);
        expect(getNumericKeep(undefined, undefined, '6.65', '156', 6)).toBe(156);
        expect(getNumericKeep(undefined, undefined, '5')).toBe(5);
        expect(getNumericKeep('15', undefined, 1)).toBe(15);
    });

    test('returns 5 when a single invalid option is given', () => {
        expect(getNumericKeep(undefined)).toBe(5);
        expect(getNumericKeep()).toBe(5);
        expect(getNumericKeep('seven')).toBe(5);
        expect(getNumericKeep('6.65')).toBe(5);
    });

    test('returns 5 when multiple invalid options are given', () => {
        expect(getNumericKeep(undefined, undefined, undefined)).toBe(5);
        expect(getNumericKeep(undefined, 'seven')).toBe(5);
        expect(getNumericKeep('seven', undefined, '6.65')).toBe(5);
        expect(getNumericKeep('6.65', undefined, 'seven')).toBe(5);
    });
});

describe('getVerboseConfiguration', () => {
    test('returns the expected verbose configuration when given an already verbose configuration', () => {
        const sampleA = [
            {
                "name": "strongeleeroy/registry-a",
                "match" : [
                    {
                        "expression": "develop-.*",
                        "keep": 5
                    }, {
                        "expression": "release\/.*"
                    }
                ]
            }, {
                "name": "strongeleeroy/registry-b",
                "keep": 3,
                "match" : [
                    {
                        "expression": "master-.*",
                        "keep": 5
                    }, {
                        "expression": "hotfix\/.*"
                    }
                ]
            }
        ];
        const sampleAexpected = [
            {
                "name": "strongeleeroy/registry-a",
                "match" : [
                    {
                        "expression": "develop-.*",
                        "keep": 5
                    }, {
                        "expression": "release\/.*",
                        "keep": 5
                    }
                ]
            }, {
                "name": "strongeleeroy/registry-b",
                "match" : [
                    {
                        "expression": "master-.*",
                        "keep": 5
                    }, {
                        "expression": "hotfix\/.*",
                        "keep": 3
                    }
                ]
            }
        ];
        expect(getVerboseConfiguration(sampleA)).toEqual(sampleAexpected);
    });

    test('returns the expected verbose configuration when given a shorthand syntax configuration', () => {
        const sampleA = [
            {
                "name": "strongeleeroy/registry-a",
                "match" : "develop-.*"
            }, {
                "name": "strongeleeroy/registry-b",
                "keep": 2,
                "match" : "develop-.*"
            }
        ];
        const sampleAexpected = [
            {
                "name": "strongeleeroy/registry-a",
                "match" : [
                    {
                        "expression": "develop-.*",
                        "keep": 5
                    }
                ]
            }, {
                "name": "strongeleeroy/registry-b",
                "match" : [
                    {
                        "expression": "develop-.*",
                        "keep": 2
                    }
                ]
            }
        ];
        expect(getVerboseConfiguration(sampleA)).toEqual(sampleAexpected);
    });

    test('returns the expected verbose configuration when given a mixed syntax configuration', () => {
        const sampleA = [
            {
                "name": "strongeleeroy/registry-a",
                "match" : "develop-.*"
            }, {
                "name": "strongeleeroy/registry-b",
                "keep": 2,
                "match" : "develop-.*"
            }, {
                "name": "strongeleeroy/registry-c",
                "keep": 10,
                "match" : [
                    {
                        "expression": "master-.*",
                        "keep": 5
                    }, {
                        "expression": "hotfix\/.*",
                        "keep": 3
                    }
                ]
            }
        ];
        const sampleAexpected = [
            {
                "name": "strongeleeroy/registry-a",
                "match" : [
                    {
                        "expression": "develop-.*",
                        "keep": 5
                    }
                ]
            }, {
                "name": "strongeleeroy/registry-b",
                "match" : [
                    {
                        "expression": "develop-.*",
                        "keep": 2
                    }
                ]
            }, {
                "name": "strongeleeroy/registry-c",
                "match" : [
                    {
                        "expression": "master-.*",
                        "keep": 5
                    }, {
                        "expression": "hotfix\/.*",
                        "keep": 3
                    }
                ]
            }
        ];
        expect(getVerboseConfiguration(sampleA)).toEqual(sampleAexpected);
    });
});