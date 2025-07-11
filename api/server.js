import { EmailService } from "../src/core/emailService.js"
import { RateLimiter } from "../src/core/rateLimiter.js";
import { MainProvider, FallbackProvider } from "../src/core/providers.js";
import { CircuitBreaker } from "../src/core/circuitBreaker.js";
import { EmailQueue } from "../src/core/queue.js";
import http from 'http';
import { parse } from "url";



const mainProvider = new MainProvider("gmail");
const fallbackProvider = new FallbackProvider("microsoft");
const mainProviderCircuit = new CircuitBreaker();
const fallBackProviderCircuit = new CircuitBreaker();

const providers = [
    { instance: mainProvider, circuit: mainProviderCircuit},
    { instance: fallbackProvider, circuit: fallBackProviderCircuit}
];

const rateLimiter = new RateLimiter(5, 10000);

const emailService = new EmailService(providers, rateLimiter);

const emailQueue = new EmailQueue(emailService);

// const testEmails = [
//     { id: 'e1', to: 'example@mail.com', subject: 'welcome', body:'This is a welcome email'},
//     { id: 'e2', to: 'anotherexample@mail.com', subject: 'Verify', body: 'This is a verification email'},
//     { id: 'e1', to: 'somemail@mail.com', subject: 'duplicate', body: 'This is a duplicate email'}
// ]

// async function runEmailTests() {
//     console.log("--- Starting Email Tests ---");

//     for (const email of testEmails) {
//         try {
//             const status = await emailService.send(email);
//             const tracked = emailService.getStatus(email.id);
//             if (status === 'RATE_LIMITED' || status === 'FAILED') {
//                 emailQueue.enqueue(email); 
//             }
//         } catch (error) {
//             console.error(`Error sending email ID ${email.id}:`, error.message);
//         }
//     }

//     console.log("\n--- Starting Rate Limiter Tests ---");

//     for (let i = 0; i < 10; i++) {
//         const id = `test_${i}`;
//         try {
//             const status = await emailService.send({
//                 id,
//                 to: `user${i}@mail.com`,
//                 subject: `rate limiter test`,
//                 body: `Email spam test for ID ${id}`
//             });
//         } catch (error) {
//             console.error(`Error sending rate limiter test email ${id}:`, error.message);
//         }
//     }

//     console.log("--- Email Tests Finished ---");
// }

// await runEmailTests();

setInterval(async ()=>{
    if (emailQueue.size() > 0){
        console.log(`Retrying ${emailQueue.size()} queued emails...`);
        await emailQueue.process();
    }
}, 10000);

const server = http.createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (req.method === 'POST' && req.url === '/send') {

        let body = '';
        req.on('data', chunk => body += chunk)
        req.on('end', async ()=>{
            try {

                const email = JSON.parse(body);
                const status = await emailService.send(email);
                if (status === 'FAILED' || status === 'RATE_LIMITED') {
                    emailQueue.enqueue(email);
                }
                const tracked = emailService.getStatus(email.id);

                res.writeHead(200, { 'content-type': 'application/json' })
                res.end(JSON.stringify({status, tracked}));

            } catch (error) {
                res.writeHead(400, { 'content-type': 'application/json'});
                res.end(JSON.stringify({error: "Invalid request or internal error"}));
            }
        })

    } else if (req.method === 'GET' && pathname.startsWith('/status/')){

        const id = pathname.split('/').pop();

        const status = emailService.getStatus(id);

        if (status) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ id, status }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Email ID not found' }));
        }

    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
})

server.listen(3000, ()=>{
    console.log("Mail server running on port: 3000")
})