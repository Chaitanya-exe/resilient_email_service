import { EmailService } from "./emailService.js"
import { RateLimiter } from "./rateLimiter.js";
import { MainProvider, FallbackProvider } from "./providers.js";

const mainProvider = new MainProvider("gmail");
const fallbackProvider = new FallbackProvider("microsoft");

const providers = [mainProvider, fallbackProvider];

const rateLimiter = new RateLimiter(5, 10000);

const emailService = new EmailService(providers, rateLimiter);

const testEmails = [
    { id: 'e1', to: 'example@mail.com', subject: 'welcome', body:'This is a welcome email'},
    { id: 'e2', to: 'anotherexample@mail.com', subject: 'Verify', body: 'This is a verification email'},
    { id: 'e1', to: 'somemail@mail.com', subject: 'duplicate', body: 'This is a duplicate email'}]

async function runEmailTests() {
    console.log("--- Starting Email Service Tests ---");

    for (const email of testEmails) {
        try {
            const status = await emailService.send(email);
            const tracked = emailService.getStatus(email.id);
            console.log(`Email ID: ${email.id} => Status: ${status} (Tracked: ${tracked})`);
        } catch (error) {
            console.error(`Error sending email ID ${email.id}:`, error.message);
        }
    }

    console.log("\n--- Starting Rate Limiter Tests ---");

    for (let i = 0; i < 6; i++) {
        const id = `test_${i}`;
        try {
            const status = await emailService.send({
                id,
                to: `user${i}@mail.com`,
                subject: `rate limiter test`,
                body: `Email spam test for ID ${id}`
            });
            console.log(`Email ${id} Status: ${status}`);
        } catch (error) {
            console.error(`Error sending rate limiter test email ${id}:`, error.message);
        }
    }

    console.log("--- Email Service Tests Finished ---");
}

await runEmailTests();