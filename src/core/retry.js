import logEvent from "./logger.js";

export default async function retry (tryFunc, retries = 3, delay = 1000) {
    try {
        return await tryFunc();
    } catch (error) {
        if (retries === 0 ) throw new Error("some error occured")
        logEvent('RETRY_EMAIL')
        return retry(tryFunc, retries - 1, delay * 2);
    }
}