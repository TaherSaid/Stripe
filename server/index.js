import * as dotenv from "dotenv";
import { readFileSync } from "fs";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import { courses } from "./dataSources/productsData.js";
import { users } from "./dataSources/userData.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: "2022-11-15",
});

const typeDefs = readFileSync("./schema.graphql").toString("utf-8");

const resolvers = {
  Query: {
    users: () => users,
    user(_, args) {
      return users.find((user) => user.id === args.id);
    },
    courses: () => courses,
    course(_, args) {
      return courses.find((course) => course.id === args.id);
    },

    checkout: async (_, args) => {
      const { StripeId, ownerAccountId } = args;
      let transfer_data;

      // If the product belong to an expert we will add the payement intent data object to the checkout session object
      if (ownerAccountId) {
        transfer_data = {
          payment_intent_data: {
            application_fee_amount: 200,
            transfer_data: {
              destination: ownerAccountId,
            },
          },
        };
      }

      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price: StripeId,
              quantity: 1,
            },
          ],
          metadata: { ownerAccount: ownerAccountId },
          mode: "payment",
          success_url: `http://localhost:3000`,
          cancel_url: "http://localhost:3000",
          // Remove the comment below, if you want to transfer the amount to the expert stripe account.
          // ...transfer_data,
        });
        return session.id;
      } catch (error) {
        console.log(error);
      }
    },

    //Checkout without product saved in stripe account
    checkoutWithoutProducts: async (_, args) => {
      const { totalPrice } = args;
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: totalPrice,
              product_data: {
                name: "name of the product",
              },
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `http://localhost:3000`,
        cancel_url: "http://localhost:3000/400",
      });
      return session.id;
    },
    retrieveCheckoutSession: async (_, args) => {
      const session = await stripe.checkout.sessions.retrieve(
        "cs_test_a1rRGYgs6y4481bdyOwAxs9TgZMiq7l8HLSOhD0kicLrXqfNRr7T3yM1"
      );
      console.log("retrieve checkout session =>", session);
      return session.payment_status;
    },
  },
  Mutation: {
    createUser(_, args) {
      const id = uuidv4();
      const newUser = { id, ...args };
      users.push(newUser);
      return newUser;
    },
    createCustomer: async (_, args) => {
      const id = uuidv4();

      try {
        const customer = await stripe.customers.create({
          email: args.email,
          name: `${args.firstName} ${args.lastName}`,
          phone: args.tel,
        });
        const newUser = { id, customerId: customer?.id, ...args };
        users.push(newUser);

        return `Welcome ${args.email} your account was created successfully`;
      } catch (error) {
        console.log(error);
      }
    },
    createAccount: async (_, args) => {
      const userId = uuidv4();
      try {
        const { id } = await stripe.accounts.create({
          type: "express",
          country: "US",
          email: args.email,
          business_type: args.businessType,
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
        });
        const accountLink = await stripe.accountLinks.create({
          account: id,
          refresh_url: "http://localhost:3000/add-account",
          return_url: "http://localhost:3000",
          type: "account_onboarding",
        });
        const newUser = { id: userId, accountId: id, ...args };
        users.push(newUser);
        return accountLink.url;
      } catch (error) {
        console.log("error =>", error);
      }
    },
    createCourse: async (_, args) => {
      const { coursePrice, courseName } = args;
      const id = uuidv4();
      const user = users.find(
        (user) => "d144e558-0eb4-42ad-9416-494351478a96" === user.id
      );
      try {
        const product = await stripe.products.create({
          name: courseName,
        });
        const price = await Promise.all(
          coursePrice?.map(async (course) => {
            const stripePrice = await stripe.prices.create({
              unit_amount: course,
              currency: "usd",
              product: product.id,
            });
            return stripePrice.id;
          })
        );
        const newCourse = {
          id,
          courseStripeId: price,
          owner: user,
          ...args,
        };
        courses.push(newCourse);
        return newCourse;
      } catch (error) {
        console.log(error);
      }
    },
  },
};

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.post(
  "/webhook",
  express.json({ type: "application/json" }),
  async (request, response) => {
    const event = request.body;

    switch (event.type) {
      case "customer.created":
        const paymentIntent = event.data.object;
        console.log(paymentIntent);
        break;
      case "checkout.session.completed":
        const session = event.data.object;
        const application_fee_amount = 200;
        try {
          const payout = await stripe.payouts.create(
            {
              amount: session.amount_total - application_fee_amount,
              currency: "usd",
              method: "instant",
              source_type: "card",
            },
            { stripeAccount: session.metadata.ownerAccount }
          );
          console.log("payout =>", payout);
        } catch (error) {
          console.log(error);
        }

        break;
      case "payment_intent.succeededd":
        const paymentMethod = event.data.object;
        console.log(paymentMethod);
        break;
      default:
    }

    response.json({ received: true });
  }
);

app.use("/", cors(), bodyParser.json(), expressMiddleware(server));
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log(`Server ready at http://localhost:4000/`);
