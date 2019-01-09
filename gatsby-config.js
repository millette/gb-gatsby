module.exports = {
  siteMetadata: {
    title: "Gatsby Default Starter",
    description:
      "Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.",
    author: "@gatsbyjs",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "miscdocs",
        path: `${__dirname}`,
        ignore: ["**/.cache", "**/public", "**/src", "**/*.json", "**/*.js"],
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-link-rewrite",
            options: {
              pattern: /^(?!https{0,1}:\/\/)\/{0,1}(.+)\.md(#.*)?$/,
              // pattern: /^(?!https{0,1}:\/\/)\/{0,1}(.+?)(?:\.md)(#.*)?$/,
              // pattern: /^(?!https{0,1}:\/\/)\/{0,1}(.+\.md?)(#.*)?$/,
              replace: "/$1$2",
            },
          },
          "gatsby-remark-autolink-headers",
        ],
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "gatsby-starter-default",
        short_name: "starter",
        start_url: "/",
        background_color: "#663399",
        theme_color: "#663399",
        display: "minimal-ui",
        icon: "src/images/gatsby-icon.png", // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    "gatsby-plugin-offline",
  ],
}
