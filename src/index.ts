import Environment from './helpers/environment';
import Registry from './helpers/registry';
import flags from './helpers/flags';
import logger, { InfoLogger } from './helpers/logging';
import { getConfiguration } from './helpers/configuration';
import { purgeImagesFromConfiguration } from './main';

export async function run() {

    InfoLogger.printSeparator();
    if (flags.dryRun) {
        logger.log('info', `Running in DRY mode. No tags will be deleted.`, { label: 'init' });
    }

    if (flags.debug) {
        logger.log('debug', 'Running in DEBUG mode. Debug messages will appear through the logs.', { label: 'init' });
    }

    if (flags.yaml) {
        logger.log('debug', 'Using YAML configuration.', { label: 'init' });
    }

    if (!Environment.username || !Environment.password) {
        throw new Error('You must provide a username and password through ENV variables. [username] and [password]')
    }

    const configuration = await getConfiguration(flags.yaml);
    const dockerhub = new Registry();
    const token = await dockerhub.getToken(Environment.username, Environment.password);

    InfoLogger.printConfiguration(configuration);
    InfoLogger.printSeparator();

    const summary = await purgeImagesFromConfiguration(dockerhub, token, configuration, flags.dryRun);

    InfoLogger.printSummary(summary);
}