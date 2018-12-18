import logger from "./logging";

export default class Environment {

    public static DEFAULT_VALUE = 'none';
    public static DEFAULT_IMAGES = 'none';
    public static DEFAULT_MATCHER_EXPRESSION = 'develop-.*';
    public static DEFAULT_KEEP = '5';
    public static DEFAULT_DEBUG = 'false';
    public static DEFAULT_DRY_RUN = 'true';

    /** Authentication */
    public static get username(): string {
        return process.env['dockerhub.username'] || Environment.DEFAULT_VALUE;
    }

    public static get password(): string {
        return process.env['dockerhub.password'] || Environment.DEFAULT_VALUE;
    }

    /**
     * DockerHub organization name.
     * @deprecated since version 3.0.0, use JSON configuration or Environment.images instead.
     * */
    public static get organization(): string {
        return process.env['dockerhub.organization'] || Environment.DEFAULT_VALUE;
    }

    /**
     * Image repository name.
     * @deprecated since version 3.0.0, use JSON configuration or Environment.images instead.
     */
    public static get image(): string {
        return process.env['dockerhub.image'] || Environment.DEFAULT_VALUE;
    }

    /**
     * List of images in "organization/registry" format. Configured as a comma separated, string list.
     */
    public static get images(): string[] {
        const envImages = process.env['dockerhub.images'] || Environment.DEFAULT_IMAGES;
        const images = envImages.split(',');
        return Array.isArray(images) ?
            images.map(image => image.trim()) :
            [];
    }

    /**
     * String value of the configured matcher expression.
     */
    public static get stringMatcherExpression(): string {
        return process.env['match.expression'] || Environment.DEFAULT_MATCHER_EXPRESSION;
    }

    /**
     * Regular expression object of the configured matcher expression.
     */
    public static get matcherExpression(): RegExp {
        return new RegExp(Environment.stringMatcherExpression);
    }

    /**
     * Numerical value of the configured keep setting.
     * @returns the numerical value of keep. If number equal or less than 0 is given, 1 is returned. Defaults to 5.
     */
    public static get keep(): number {
        const envKeep = process.env['keep'] || Environment.DEFAULT_KEEP;
        const parsed = parseInt(envKeep);
        const keep = isNaN(parsed) ? 5 : parsed;
        if (keep <= 0) {
            logger.log('warn', '"keep" setting is less than 1. Setting keep to 1.');
            return 1;
        }
        return keep;
    }
}