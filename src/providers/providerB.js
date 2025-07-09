export class FallbackProvider{
    constructor(name) {
        this.name = name
    }
    
    async sendMail(){

        // This line simulates 60% of success rate
        setTimeout(()=>{}, 1000);
        const success = Math.random() > 0.4

        if (!success){
            throw new Error("Failed to send email")
        }

        return true;
    }
}

