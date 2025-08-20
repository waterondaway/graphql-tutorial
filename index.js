const express = require("express");
const app = express();
const userData = require("./MOCK_DATA.json");
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
} = require("graphql");
const { graphqlHTTP } = require("express-graphql");
const port = 3000;

const UserType = new GraphQLObjectType({
    name: "User",
    fields: {
        id: { type: GraphQLInt },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    },
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    description: "getALlUsers,getUser(id)",
    fields: {
        getAllUsers: {
            type: new GraphQLList(UserType),
            resolve(parent) {
                return userData;
            },
            description: "get all users from database",
        },
        getUser: {
            type: UserType,
            args: {
                id: { type: GraphQLInt },
            },
            resolve(parent, args) {
                return userData.find((user) => user.id == args.id);
            },
            description: "get user by id ",
        },
    },
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createUser: {
            type: UserType,
            args: {
                first_name: { type: GraphQLString },
                last_name: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            resolve(parent, args) {
                userData.push({
                    id: userData.length + 1,
                    first_name: args.first_name,
                    last_name: args.last_name,
                    email: args.email,
                    password: args.password,
                });
                return args;
            },
        },
    },
});

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});

app.use(
    "/graphql",
    graphqlHTTP({
        schema,
        graphiql: true,
    })
);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
