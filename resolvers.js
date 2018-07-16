import { find } from 'lodash'
import { authors, posts, agents } from './data'

const resolvers = {
  Query: {
    posts: () => posts,
    authors: () => authors,
    agents: () => agents,
    people: () => agents.concat(authors),
    agent: (_, args) => find(agents,{ id: args.id }),
    author: (_, args) => find(authors, { id: args.id }),
  },
  Author: {
    posts: (author) => filter(posts, { authorId: author.id }),
  },
  Post: {
    author: (post) => find(authors, { id: post.authorId }),
  },
  Agent: {
    represents: (agent) => filter(authors, { agent: agent})
  },
  People: {
      // It is required because objects returned from the "people" query
      //    must be defined types, not interface types
      __resolveType(data, context, info) {
        console.log('Got data of: ' + JSON.stringify(data))
  		  if (data.agent) {
          return 'Author'
        } else {
          return 'Agent'
        }
      }
  },
};

export { resolvers }