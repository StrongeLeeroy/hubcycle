import { VerboseImageConfig } from "./helpers/configuration";
import logger from "./helpers/logging";
import Registry from "./helpers/registry";

export async function purgeImagesFromConfiguration(registry: Registry, token: string, configuration: VerboseImageConfig[], dryRun: boolean): Promise<string[]> {
    let summary: string[] = [];
    for (const image of configuration) {
        for (const match of image.match) {
            logger.log('debug', `Running with matcher [${match.expression}] and "keep" value [${match.keep}].`, { label: image.name });
            const current = await registry.purgeBuilds(token, image.name, new RegExp(match.expression), match.keep, dryRun);
            summary = [...summary, ...current.success];
            const plural = current.success.length !== 1
            logger.log('info', `Task completed, ${current.success.length} tag${plural ? 's have' : ' has'} been deleted.\n`, { label: image.name });
        }
        
    }
    return summary;
}