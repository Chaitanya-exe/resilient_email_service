export class MainProvider{
    constructor(name) {
        this.name = name
    }
    
    // Member function which mocks the sending of an email
    async sendMail(email){

        // This line simulates 50% of success rate
        console.log(`[${this.name}] Attempting to send email...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const success = Math.random() > 0.5

        if (!success){
            throw new Error(`${this.name} failed to send email`)
        }

        return true;
    }
}

export class FallbackProvider{
    constructor(name) {
        this.name = name
    }
    
    // Member function to mock email sending
    async sendMail(email){

        // This line simulates 50% of success rate
        console.log(`[${this.name}] Attempting to send email...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const success = Math.random() > 0.5

        if (!success){
            throw new Error(`${this.name} failed to send email`)
        }

        return true;
    }
}