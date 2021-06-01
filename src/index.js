const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const findLinkIndex = (links, argId) => {
  const index = links.findIndex((link) => link.id === argId);
  if (index === -1) return false;
  return index;
};

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: async (parent, args, context) => context.prisma.link.findMany(),
  },
  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
  },
  Mutation: {
    post: (parent, args, context) => {
      const link = context.prisma.link.create({
        data: {
          description: args.description,
          url: args.url,
        },
      });
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

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: {
    prisma,
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
