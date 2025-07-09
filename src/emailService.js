import retry from "./retry";

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
            const provider = this.providers[i];

            try {

                await retry(()=> provider.sendEmail(email));
                this.sentIds.add(id);
                this.statusMap.set(id, 'SUCCESS');
                return 'SUCCESS';

            } catch (error) {
                
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