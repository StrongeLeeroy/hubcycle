import { readFile as fsReadFile } from 'fs';
import yaml from 'js-yaml';
import { promisify } from 'util';
import logger from './logging';
import Environment from './environment';

const readFile = promisify(fsReadFile);

export interface ImageConfig {
    name: string;
    keep?: number;
    match: MatcherConfig[] | string;
}

export interface MatcherConfig {
    expression: string;
    keep?: number | string;
}

export interface VerboseImageConfig {
    name: string;
    match: VerboseMatcherConfig[];
}

export interface VerboseMatcherConfig {
    expression: string;
    keep: number;
}

export async function getConfiguration(useYaml: boolean): Promise<VerboseImageConfig[]> {
    logger.log('debug', 'Reading configuration file from /config/images.json', { label: 'config' });
    const extension = useYaml ? 'yaml' : 'json',
        configFile = await readFile(`/config/images.${extension}`, 'utf8');

    if (configFile) {
        logger.log('debug', 'Configuration file found. Validating...', { label: 'config' });
        const config = useYaml ?
            yaml.safeLoad(configFile) :
            JSON.parse(configFile);

        let imageConfig: ImageConfig[];
        if (config.images) {
            imageConfig = config.images;
        } else {
            logger.log('warn', 'DEPRECATION WARNING: Using deprecated configuration object shape. You must place the list of images under the "images" key in both JSON and YAML configuration files. This is just a warning, but it will become an error in the next major release.');
            imageConfig = config;
        }

        if (validateConfig(imageConfig)) {
            logger.log('debug', 'Configuration file is valid.', { label: 'config' });
            return getVerboseConfiguration(imageConfig);
        } else {
            logger.log('error', 'Invalid configuration file. Defaulting to ENV configuration.', { label: 'config' });
            return getEnvConfiguration();
        }
    } else {
        logger.log('warn', 'No configuration file in available. Defaulting to ENV configuration.', { label: 'config' });
        return getEnvConfiguration();
    }
}

export function getVerboseConfiguration(config: ImageConfig[]): VerboseImageConfig[] {
    const verboseConfiguration: VerboseImageConfig[] = [];

    for (const image of config) {
        const matches: VerboseMatcherConfig[] = [];

        if (typeof image.match === 'string') {
            matches.push({ expression: image.match, keep: getNumericKeep(image.keep) });
        } else {
            for (const match of image.match) {
                matches.push({
                    expression: match.expression,
                    keep: getNumericKeep(match.keep, image.keep)
                });
            }
        }

        verboseConfiguration.push({
            name: image.name,
            match: matches
        });
    }

    return verboseConfiguration;
}

export function getNumericKeep(...options: Array<string | number | undefined>): number {
    for (const option of options) {
        if (option && validKeep(option)) {
            return typeof option === 'string' ?
                parseInt(option) :
                option;
        }
    }
    return 5;
}

export function getEnvConfiguration(): VerboseImageConfig[] {
    const imageConfig: ImageConfig[] = [];
    const images = Environment.images,
        keep = Environment.keep,
        organization = Environment.organization;

    for (const image of images) {
        imageConfig.push({
            name: `${organization}${image}`,
            keep,
            match: Environment.matcherExpression.toString()
        });
    }
    if (!validateConfig(imageConfig) || imageConfig.length <= 0) {
        throw new Error('Invalid ENV configuration. No valid configuration sources are available.');
    }

    return getVerboseConfiguration(imageConfig);
}

export function validateConfig(config: ImageConfig[]) {
    const valid = [];
    const invalid = [];

    for (const image of config) {
        if (validImageName(image.name) && validKeep(image.keep) && validMatch(image.match)) {
            valid.push(image);
        } else {
            invalid.push(image);
        }
    }

    return config.length > 0 && invalid.length === 0;
    
}

export function validMatch(match: MatcherConfig[] | string) {

    /* If match is falsy, mark it as INVALID */
    if (!match) {
        return false;

    /* If match is a string, delegate to regulax expression validator */
    } else if (typeof match === 'string') {
        return validMatchExpression(match);

    /* If match is an array, test each object individually by recursivelly runnig validMatch and validKeep */
    } else if (Array.isArray(match)) {
        for (const matchObject of match) {
            if (!validMatch(matchObject.expression) || !validKeep(matchObject.keep)) {
                return false;
            }
        }
        return true;

    /* Mark every other case as INVALID */
    } else {
        return false;
    }
}

export function validMatchExpression(expression: string) {
    try {
        const regex = new RegExp(expression);
        return true;
    } catch (e) {
        logger.log('error', `Invalid regular expression string [${expression}].`, { label: 'config' });
        return false;
    }
}

/**
 * Integers, parseable integert and undefined values are acceptable.
 */
export function validKeep(keep?: any): boolean {
    if (typeof keep === 'undefined') {
        return true;
    } else if (typeof keep === 'number' || !isNaN(parseInt(keep))) {
        return keep % 1 === 0;
    } else {
        return false;
    }
}

export function validImageName(name: string): boolean {
    if (typeof name !== 'string') {
        logger.log('error', `Invalid image name [${name}]. The "name" property must be a string.`, { label: 'config' });
        return false;
    } else if (name.indexOf(':') >= 0) {
        logger.log('error', `Invalid image name [${name}]. Tags should not me part of the name, please use the "component/name" format.`, { label: 'config' });
        return false;
    } else if (name.indexOf('___') >= 0) {
        logger.log('error', `Invalid image name [${name}]. Valid names cannot include three (3) consecutive underscore (_) characters.`, { label: 'config' });
        return false;
    }

    const matcher = /^[a-z][a-z\-_\.]*[a-z]$/;
    const components = name.split('/');

    for (const component of components) {
        if (!matcher.test(component)) {
            logger.log('error', `Invalid image name [${name}]. Valid names can only contain lowercase characters and separators (".", "-" and "_")`, { label: 'config' });
            return false;
        }
    }

    return true;
}