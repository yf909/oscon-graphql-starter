import express from 'express'
import graphqlHTTP from 'express-graphql'
import http from 'http'

// init express app and http server
var app = express();
const server = http.createServer(app)

// "Mock" database is simply programmer-deined data ====
const agents = [
  { id: 1, firstName: 'Larry', middleInitial: 'L', lastName: 'Thomas'},
  { id: 2, firstName: 'Bill', middleInitial: 'R', lastName: 'Lewis' }
]

const authors = [
  { id: 1, firstName: 'Tom', middleInitial: 'W',lastName: 'Coleman', agent: find(agents,{id: 1})},
  { id: 2, firstName: 'Sashko', middleInitial: 'L', lastName: 'Stubailo', agent: find(agents,{id: 2})},
  { id: 3, firstName: 'Mikhail', middleInitial: 'R', lastName: 'Novikov', agent: find(agents, {id: 1}) },
];

const posts = [
  { id: 1, authorId: 1, title: 'Introduction to GraphQL',articleType: 'REVIEW' },
  { id: 2, authorId: 2, title: 'GraphQL Rocks', articleType:  'OPINION' },
  { id: 3, authorId: 2, title: 'Advanced GraphQL', articleType: 'TECHNICAL' },
  { id: 4, authorId: 3, title: 'Launchpad is Cool', articleType: 'OPINION' },
];

// ====

const typeDefs =
`
  type Author {
    id: ID!
    firstName: String
    middleInitial: String
    lastName: String
    posts: [Post]
  }

  type Post {
    id: Int!
    title: String
    author: Author
    articleType: String
  }

  type Query {
    posts: [Post]
    authors: [Author]
    author(id: Int!): Author
  }
`;

const resolvers = {
  Query: {
    posts: () => posts,
    authors: () => authors,
    author: (_, args) => find(authors, { id: args.id }),
  },
  Author: {
    posts: (author) => filter(posts, { authorId: author.id }),
  },
  Post: {
    author: (post) => find(authors, { id: post.authorId }),
  },
};

// Compile schema
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Provide a graphQL-only endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

server.listen(4000);
console.log(
  'Express server listening on port %d in %s mode',
  server.address().port, app.settings.env
)
