export class MainProvider{
    constructor(name) {
        this.name = name
    }
    
    // Member function which mocks the sending of an email
    async sendMail(){

        // This line simulates 70% of success rate
        await new Promise(resolve => setTimeout(resolve, 1000));
        const success = Math.random() > 0.3

        if (!success){
            throw new Error("Failed to send email")
        }

        return true;
    }
}