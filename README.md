![Logo](https://cdn.freebiesupply.com/images/large/2x/stripe-logo-white-on-blue-gradient.png)

# Stripe Implementation with Next.js and Express-GraphQL

This project demonstrates how to integrate Stripe payment gateway into a Next.js frontend and an Express-GraphQL backend using Apollo Client.

## Overview

This proof of concept project showcases the implementation of Stripe payment gateway in a full-stack JavaScript application. The frontend is built with Next.js, a React framework, while the backend uses Express-GraphQL as a server and Apollo Client as a GraphQL client. The project aims to provide a seamless payment experience to users and demonstrate the integration of Stripe's API.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repo.git

2. Navigate to the client folder and install the required dependencies:

```bash
cd client
yarn
```
3. Similarly, navigate to the server folder and install the required dependencies:

```bash
cd server
npm install
```
4. Create a .env file in the server folder and set your STRIPE_SECRET_KEY there. For example:

```bash
STRIPE_SECRET_KEY=your-stripe-secret-key
```
5. Start the development server for both the client and server:

```bash
# In the client folder
yarn dev

# In the server folder
yarn start

```

6. Open your browser and navigate to http://localhost:3000 to see the application in action.

7. Your endPoint url is http://localhost:4000

## Additional Resources

[Stripe API Documentation](https://stripe.com/docs/api)

[Next.js Documentation](https://nextjs.org/docs)

[Express-GraphQL Documentation](https://graphql.org/learn/)

[Apollo Client Documentation](https://www.apollographql.com/docs/react/)
