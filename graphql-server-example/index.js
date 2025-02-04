import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs as bookTypeDefs, resolvers as bookResolvers } from './schemas/bookSchema.js';

const server = new ApolloServer({
    typeDefs: [bookTypeDefs],
    resolvers: [bookResolvers],
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
