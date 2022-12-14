import { ApolloServer } from "apollo-server";
import * as dotenv from "dotenv";
import { readFileSync } from "fs";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import { courses } from "./dataSources/productsData.js";
import { users } from "./dataSources/userData.js";

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

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: StripeId,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `http://localhost:3000`,
        cancel_url: "http://localhost:3000",
        payment_intent_data: {
          application_fee_amount: 200,
          transfer_data: {
            destination: ownerAccountId,
          },
        },
      });
      // console.log(session);
      return session.id;
    },
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
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
