import retry from "./retry.js";

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
            return 'IDEMPOTENT'
        }

        if (!this.rateLimiter.allow()) {
            this.statusMap.set(id, 'RATE_LIMITED');
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
                return 'SUCCESS';

            } catch (error) {
                circuit.recordFailure();
                if (i === this.providers.length - 1) {
                    this.statusMap.set(id, 'FAILED');
                    return 'FAILED';
                } else {
                    this.statusMap.set(id, 'FALLBACK')
                }
            }
        }
    }

    getStatus(emailId){
        return this.statusMap.get(emailId)
    }
}