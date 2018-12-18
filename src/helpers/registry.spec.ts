import Registry, { MinimalImageTag } from './registry';

const sampleTags = [
    {
        name: 'master-002',
        full_size: 17472493,
        images: [],
        id: 41530569,
        repository: 5941684,
        creator: 297808,
        last_updater: 297808,
        last_updated: '2018-12-06T10:19:39.827406Z',
        image_id: null,
        v2: true
    }, {
        name: 'develop-006',
        full_size: 17472493,
        images: [],
        id: 41530569,
        repository: 5941684,
        creator: 297808,
        last_updater: 297808,
        last_updated: '2018-12-05T10:29:39.827406Z',
        image_id: null,
        v2: true
    }, {
        name: 'master-001',
        full_size: 17472493,
        images: [],
        id: 41530569,
        repository: 5941684,
        creator: 297808,
        last_updater: 297808,
        last_updated: '2018-12-05T10:19:39.827406Z',
        image_id: null,
        v2: true
    }, {
        name: 'develop-005',
        full_size: 17793436,
        images: [],
        id: 41533955,
        repository: 5941684,
        creator: 297808,
        last_updater: 297808,
        last_updated: '2018-12-05T10:07:11.794544Z',
        image_id: null,
        v2: true
    }, {
        name: 'develop-004',
        full_size: 17793449,
        images: [],
        id: 38018438,
        repository: 5941684,
        creator: 297808,
        last_updater: 297808,
        last_updated: '2018-12-05T08:23:22.595744Z',
        image_id: null,
        v2: true
    }, {
        name: 'develop-003',
        full_size: 14404462,
        images: [],
        id: 39328879,
        repository: 5941684,
        creator: 297808,
        last_updater: 297808,
        last_updated: '2018-11-06T14:59:13.324619Z',
        image_id: null,
        v2: true
    }, {
        name: 'develop-002',
        full_size: 14424073,
        images: [],
        id: 35704890,
        repository: 5941684,
        creator: 297808,
        last_updater: 297808,
        last_updated: '2018-10-16T07:39:02.206318Z',
        image_id: null,
        v2: true
    }, {
        name: 'develop-001',
        full_size: 7916131,
        images: [],
        id: 34476820,
        repository: 5941684,
        creator: 297808,
        last_updater: 297808,
        last_updated: '2018-09-04T10:35:56.157636Z',
        image_id: null,
        v2: true
    }
];

describe('getTagsToPurge', () => {
    test('returns the filtered, mapped, sorted and sliced array of tags based on the input parameters', () => {
        const registry = new Registry();

        const testA = registry.getTagsToPurge(sampleTags, /develop-.*/, 3);
        const testAexpected: MinimalImageTag[] = [
            {
                name: 'develop-003',
                last_updated: new Date('2018-11-06T14:59:13.324619Z')
            }, {
                name: 'develop-002',
                last_updated: new Date('2018-10-16T07:39:02.206318Z')
            }, {
                name: 'develop-001',
                last_updated: new Date('2018-09-04T10:35:56.157636Z')
            }
        ];
        expect(testA).toEqual(testAexpected);

        const testB = registry.getTagsToPurge(sampleTags, /master-.*/, 3);
        const testBexpected: MinimalImageTag[] = [];
        expect(testB).toEqual(testBexpected);

        const testC = registry.getTagsToPurge(sampleTags, /master-.*/, 1);
        const testCexpected = [
            {
                name: 'master-001',
                last_updated: new Date('2018-12-05T10:19:39.827406Z')
            }
        ];
        expect(testC).toEqual(testCexpected);

        const testD = registry.getTagsToPurge(sampleTags, /develop-.*/, 1);
        const testDexpected: MinimalImageTag[] = [
            {
                name: 'develop-005',
                last_updated: new Date('2018-12-05T10:07:11.794544Z')
            }, {
                name: 'develop-004',
                last_updated: new Date('2018-12-05T08:23:22.595744Z')
            }, {
                name: 'develop-003',
                last_updated: new Date('2018-11-06T14:59:13.324619Z')
            }, {
                name: 'develop-002',
                last_updated: new Date('2018-10-16T07:39:02.206318Z')
            }, {
                name: 'develop-001',
                last_updated: new Date('2018-09-04T10:35:56.157636Z')
            }
        ];
        expect(testD).toEqual(testDexpected);

        const testE = registry.getTagsToPurge(sampleTags, /develop-.*/, 50);
        const testEexpected: MinimalImageTag[] = [];
        expect(testE).toEqual(testEexpected);

        const testF = registry.getTagsToPurge(sampleTags, /.*/, 10);
        const testFexpected: MinimalImageTag[] = [];
        expect(testF).toEqual(testFexpected);

        const testG = registry.getTagsToPurge(sampleTags, /.*/, 8);
        const testGexpected: MinimalImageTag[] = [];
        expect(testG).toEqual(testGexpected);

        const testH = registry.getTagsToPurge(sampleTags, /.*/, 7);
        const testHexpected: MinimalImageTag[] = [
            {
                name: 'develop-001',
                last_updated: new Date('2018-09-04T10:35:56.157636Z')
            }
        ];
        expect(testH).toEqual(testHexpected);

        const testI = registry.getTagsToPurge(sampleTags, /.*/, 3);
        const testIexpected: MinimalImageTag[] = [
            {
                name: 'develop-005',
                last_updated: new Date('2018-12-05T10:07:11.794544Z')
            }, {
                name: 'develop-004',
                last_updated: new Date('2018-12-05T08:23:22.595744Z')
            }, {
                name: 'develop-003',
                last_updated: new Date('2018-11-06T14:59:13.324619Z')
            }, {
                name: 'develop-002',
                last_updated: new Date('2018-10-16T07:39:02.206318Z')
            }, {
                name: 'develop-001',
                last_updated: new Date('2018-09-04T10:35:56.157636Z')
            }
        ];
        expect(testI).toEqual(testIexpected);

    });
});