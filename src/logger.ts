export class Logger {
    private static _instance: Logger = null;

    public static getInstance = (): Logger => {
        if (Logger._instance === null) {
            Logger._instance = new Logger();
        }
        return Logger._instance;
    }

    public trace = (msg: string) => {
        console.log(msg);
    }
}
