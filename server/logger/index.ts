export const logger = {
    info(message: unknown) {
        console.log("[INFO]", message);
    },
    warn(message: unknown) {
        console.warn("[WARN]", message);
    },
    error(message: unknown) {
        console.error("[ERROR]", message);
    },
};