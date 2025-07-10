import logEvent from "./logger.js";

export class EmailQueue{
    constructor(emailService){
        this.queue = [];
        this.emailService = emailService;
    }

    enqueue(email){
        this.queue.push(email);
        logEvent("EMAIL_QUEUED", {id: email.id});
    }

    async process(){

        const remaining = [];
        for (const email of this.queue) {
            
            logEvent("RETRY_QUEUE", {id: email.id});
            const status = await this.emailService.send(email);
            if (status !== 'SUCCESS' && status !== 'DUPLICATE'){
                remaining.push(email);
                logEvent("EMAIL_QUEUED", {id: email.id});
            }

        }

        this.queue = remaining;
    }

    size(){
        return this.queue.length;
    }
}