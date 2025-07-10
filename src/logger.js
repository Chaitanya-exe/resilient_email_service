export default function logEvent(event, meta = {}) {
    const now = new Date()
    console.log(`[${now.toISOString()}] ${event}`, meta);
}