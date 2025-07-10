export class CircuitBreaker{
    constructor(threshold = 3, resetTimeout = 10000){
        this.threshold = threshold;
        this.resetTimeout = resetTimeout;
        this.failureCount = 0;
        this.lastFailedAt = null
        this.state = 'CLOSED'
    }

    recordFailure(){
        this.failureCount++;
        this.lastFailedAt = Date.now();
        if (this.failureCount >= this.threshold){
            this.state = 'OPEN';
        }
    }

    recordSuccess(){
        this.failureCount = 0;
        this.state = 'CLOSED';
    }

    canRequest(){
        if (this.state === 'OPEN'){
            const now = Date.now()
            if (this.lastFailedAt - now > this.resetTimeout){
                this.state === 'HALF_OPEN';
                return true;
            }
            return false;
        }
        return true;
    }
}