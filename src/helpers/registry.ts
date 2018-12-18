import axios from 'axios';
import logger from './logging';

export interface ImageTagsResponse {
    count: number;
    next: any;
    previous: any;
    results: ImageTag[];
}

export interface ImageTag {
    name: string;
    full_size: number;
    images: Image[];
    id: number;
    repository: number;
    creator: number;
    last_updater: number;
    last_updated: string;
    image_id: any;
    v2: boolean;
}

export interface MinimalImageTag {
    name: string;
    last_updated: Date;
}

export interface Image {
    size: number;
    architecture: string;
    variant: any;
    features: any;
    os: string;
    os_version: any;
    os_features: any;
}

export interface PurgeResult {
    success: string[];
    failure: string[];
}

export default class Registry {

    public static URL_BASE = 'https://hub.docker.com';

    constructor() {}

    private buildHeaders(token: string): any {
        return { "Authorization": `JWT ${token}` };
    }

    public async getToken(username: string, password: string): Promise<string> {
        logger.log('debug', `Fetching auth token for user ${username}...`, { label: 'auth' });
        try {
            const response = await axios.post(`${Registry.URL_BASE}/v2/users/login/`, { username, password });
            return response.data.token;
        } catch (error) {
            throw new Error(error);
        }
    }

    public async getTags(token: string, image: string): Promise<ImageTag[]> {
        logger.log('debug', `Fetching all tags for image...`, { label: image });
        try {
            const headers = this.buildHeaders(token);
            const response = await axios.get<ImageTagsResponse>(`${Registry.URL_BASE}/v2/repositories/${image}/tags`, { headers });

            logger.log('debug', `Found a total of ${response.data.results.length} tags:`, { label: image });
            for (let tag of response.data.results) {
                logger.log('debug', `  => ${tag.name}`, { label: image })
            }

            return response.data.results;
        } catch (error) {
            throw new Error(error);
        }
    }

    public async purgeBuilds(token: string, image: string, matcher: RegExp = /develop-.*/, keep: number = 5, dryRun: boolean = true): Promise<PurgeResult> {
        const tags = await this.getTags(token, image);
        const developmentTags = this.getTagsToPurge(tags, matcher, keep);

        if (developmentTags.length > 0) {
            logger.log('debug', `Detected ${developmentTags.length} tag(s) ready to purge:`, { label: image });
        } else {
            logger.log('debug', `-- No tags to purge --`, { label: image });
        }

        for (let tag of developmentTags) {
            logger.log('debug', `  => ${tag.name}`, { label: image })
        }

        const success = [], failure = [];
        for (let tag of developmentTags) {
            const fullTag = `${image}:${tag.name}`;
            try {
                const result = await this.deleteTag(token, image, tag.name, dryRun);
                success.push(fullTag);
            } catch (error) {
                failure.push(fullTag);
            }
        }

        return { success, failure };
    }

    public async deleteTag(token: string, image: string, tag: string, dryRun: boolean = true): Promise<string> {
        logger.log('debug', `Deleting ${tag} from ${image} registry...`, { label: image });

        if (dryRun) {
            logger.log('debug', `DRY-RUN - Tag ${tag} was deleted from registry.`, { label: image });
            return `${image}:${tag}`;
        } else {
            try {
                const headers = this.buildHeaders(token);
                const response = await axios.delete(`${Registry.URL_BASE}/v2/repositories/${image}/tags/${tag}/`, { headers });
                logger.log('debug', `Tag ${tag} was deleted from registry.`, { label: image });
                return tag;
            } catch (error) {
                logger.log('error', `Could not delete tag ${tag} from registry.`, { label: image });
                throw new Error(error);
            }
        }
    }

    public getTagsToPurge(tags: ImageTag[], matcher: RegExp, keep: number = 5): MinimalImageTag[] {
        return tags
            .filter(tag => matcher.test(tag.name))
            .map(({ name, last_updated }) => ({ name, last_updated: new Date(last_updated) }))
            .sort((a, b) => b.last_updated.getTime() - a.last_updated.getTime())
            .slice(keep);
    }
}