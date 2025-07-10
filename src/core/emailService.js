import retry from "./retry.js";
import logEvent from "./logger.js";

export class EmailService{

    constructor(providers, rateLimiter){
        
        this.providers = providers
        this.rateLimiter = rateLimiter
        this.statusMap = new Map()
        this.sentIds = new Set()

    }

    async send(email) {
        const {id} = email

        if (this.sentIds.has(id)) {
            logEvent("DUPLICATE", {id: id})
            return 'DUPLICATE'
        }

        if (!this.rateLimiter.allow()) {
            this.statusMap.set(id, 'RATE_LIMITED');
            logEvent("RATE_LIMITED")
            return 'RATE_LIMITED';
        }

        for (let i = 0; i < this.providers.length; i++){
            const provider = this.providers[i].instance;
            const circuit = this.providers[i].circuit;

            if (!circuit.canRequest()) {
                console.log(`${provider.name} is currently in OPEN state, skipping`);
                continue;
            }

            try {

                await retry(()=> provider.sendMail(email));
                this.sentIds.add(id);
                this.statusMap.set(id, 'SUCCESS');
                circuit.recordSuccess();
                logEvent("EMAIL_SENT", {to: email.to});
                return 'SUCCESS';

            } catch (error) {
                circuit.recordFailure();
                if (i === this.providers.length - 1) {
                    this.statusMap.set(id, 'FAILED');
                    logEvent("FAILED", {name: provider.name})
                    return 'FAILED';
                } else {
                    logEvent("FALLBACK", {name: provider.name})
                    this.statusMap.set(id, 'FALLBACK')
                }
            }
        }
    }

    getStatus(emailId){
        return this.statusMap.get(emailId)
    }
}