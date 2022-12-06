import { ApolloServer } from "apollo-server";
import { users } from "./dataSources/userData.js";
import { courses } from "./dataSources/productsData.js";
import { readFileSync } from "fs";
import { v4 as uuidv4 } from "uuid";

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
  },
  Mutation: {
    createUser(_, args) {
      const id = uuidv4();
      const newUser = { id, ...args };
      users.push(newUser);
      return newUser;
    },
    createCourse(_, args) {
      const id = uuidv4();
      const user = users.find(
        (user) => "d144e558-0eb4-42ad-9416-494351478a96" === user.id
      );
      console.log(user);
      const newCourse = {
        id,
        owner: user,
        ...args,
      };
      courses.push(newCourse);
      return newCourse;
    },
  },
};
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
