# Resilient Email Service

This project is a resilient email service that utilizes advanced techniques to ensure reliable email delivery. Built with **pure JavaScript** and no external dependencies for the core functionality, this service implements retry with exponential backoff, circuit breaking, rate limiting, and queuing for enhanced reliability and fault tolerance.

## Architecture

The project follows a modular architecture with the following components:

- **EmailService**: Central service that coordinates email sending with resiliency features
- **CircuitBreaker**: Monitors and prevents repeated failures by temporarily blocking requests
- **RateLimiter**: Controls the request rate to prevent overwhelming providers
- **EmailQueue**: Maintains a queue of emails to be sent, with retry capability
- **Providers**: Adapters for different email service providers
- **Retry**: Utility for retrying failed operations with exponential backoff

## Features

### 1. **Retry with Exponential Backoff**
The service implements a retry mechanism to handle temporary failures when sending emails. It uses an exponential backoff strategy to progressively increase the wait time between retries, enhancing the chances of recovery from transient errors.

### 2. **Circuit Breaking**
The circuit breaker pattern is implemented to prevent the system from repeatedly executing failed requests. If the failure rate reaches a certain threshold, the circuit breaker trips to the 'OPEN' state, halting requests for a specified period until the system stabilizes.

### 3. **Rate Limiting**
Rate limiting ensures that the number of requests to the email providers stays within reasonable limits. This helps in preventing API rate-limit violations and controlling traffic flow during high-load scenarios.

### 4. **Queueing**
Emails are queued for processing, which allows for orderly handling of messages and manages the load on the email providers. The queue supports retrying of failed delivery attempts.

### 5. **Providers and Fallbacks**
The email service can route emails through multiple providers, using fallbacks in case of primary provider failures. This redundancy increases the overall reliability of the service.

## Dependencies

This project is built with minimal external dependencies:

- **Core Functionality**: Implemented entirely with native JavaScript/Node.js components. No external libraries are used for the core email service functionality, ensuring lightweight operation and minimal dependency risks.

- **Testing**: Jest is the only external dependency, used exclusively for testing purposes. This ensures the core functionality remains independent of third-party libraries.

```json
"devDependencies": {
  "@babel/core": "^7.23.7",
  "@babel/preset-env": "^7.23.8",
  "babel-jest": "^29.7.0",
  "jest": "^30.0.4"
}
```

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd resilient_email_service
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Usage

- **Index.js Version:** This version of the service allows direct invocation of the email services through an interactive session:
  ```bash
  node src/index.js
  ```

- **API Version:** Exposes the email service via a RESTful API to interact with other applications.
  ```bash
  npx nodemon api/server.js
  ```

## Project Structure

```
/src
  /core              # Core resilience components
    circuitBreaker.js  # Circuit breaker implementation
    emailService.js    # Main email service
    logger.js          # Logging utility
    providers.js       # Email providers
    queue.js           # Email queue
    rateLimiter.js     # Rate limiting
    retry.js           # Retry with exponential backoff
  index.js            # CLI version entry point
/api
  server.js           # RESTful API server
/test
  /core               # Unit tests for core components
```

## Testing

The project includes a comprehensive test suite to verify the core functionalities of the email service. The tests cover scenarios including rate limiting, circuit breaking, exponential retry handling, and queuing.

Run the tests using:
```bash
npm test
```