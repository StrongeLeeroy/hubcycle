import { createLogger, format, transports } from 'winston';
import flags from './flags';
import { VerboseImageConfig } from './configuration';

const appFormat = format.printf(({ metadata, level, message }) => {
    return `[${metadata.timestamp}][${metadata.label || 'global'}] ${level}: ${message}`;
});

const logger = createLogger({
    level: flags.debug ? 'debug' : 'info',
    format: format.combine(
        format.timestamp(),
        format.metadata(),
        appFormat
    ),
    transports: [
        new transports.Console()
    ]
});

export default logger;

export class InfoLogger {

    public static printSeparator() {
        logger.log('info', '============================================================\n', { label: 'init' });
    }

    public static printSummary(summary: string[]) {
        logger.log('info', '----------- DELETED TAGS -----------', { label: 'summary' });
        if (summary.length > 0) {
            for (const tag of summary) {
                logger.log('info', `${tag}`, { label: 'summary' });
            }
        } else {
            logger.log('info', 'none', { label: 'summary' });
        }
        logger.log('info', '------------------------------------\n', { label: 'summary' });
        logger.log('info', 'All tasks completed. Ready to exit.', { label: 'exit' });
    }

    public static printConfiguration(configuration: VerboseImageConfig[]) {
        logger.log('info', `${configuration.length} image${configuration.length !== 1 ? 's' : ''} to be processed:`, { label: 'init' });
        for (const image of configuration) {
            logger.log('info', `    => ${image.name}`, { label: 'init' });
        }
    }
    
}



