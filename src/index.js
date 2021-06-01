const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
];

let idCount = links.length;

const findLinkIndex = (links, argId) => {
  const index = links.findIndex((link) => link.id === argId);
  if (index === -1) return false;
  return index;
};

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
  },
  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    },
    updateLink: (parent, args) => {
      const { id, description, url } = args;
      const linkIndex = findLinkIndex(links, id);
      if (!linkIndex) return;
      links[linkIndex] = { ...links[linkIndex], url, description };
      return links[linkIndex];
    },
    deleteLink: (parent, args) => {
      const { id } = args;
      const linkIndex = findLinkIndex(links, id);
      if (!linkIndex) return;
      return links.splice(linkIndex, 1)[0];
    },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
