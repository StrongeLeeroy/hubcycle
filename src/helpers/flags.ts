export class Flags {
    public flags: string[];

    constructor() {
        this.flags = process.argv.slice(2);
    }

    public get debug(): boolean {
        return this.flags.indexOf('-d') >=0 || this.flags.indexOf('--debug') >= 0;
    }

    public get dryRun(): boolean {
        return this.flags.indexOf('--dry-run') >= 0;
    }
}

const flags = new Flags();
export default flags;