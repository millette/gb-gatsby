module.exports = {
  siteMetadata: {
    title: "EDM5240-H2019",
    description:
      "Technologies de l'information appliquées au journalisme [ou journalisme informatique] - Session d'hiver 2019.",
    author: "@jhroy",
    lang: "fr",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "miscdocs",
        path: `${__dirname}`,
        ignore: [
          "**/.cache",
          "**/.git",
          "**/public",
          "**/src",
          "**/*.json",
          "**/*.js",
        ],
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 1344,
              linkImagesToOriginal: false,
              quality: 75,
            },
          },
          {
            resolve: "gatsby-remark-emojis",
            options: {
              active: true,
              size: 64,
            },
          },
          {
            resolve: "gatsby-remark-link-rewrite",
            options: {
              pattern: /^(?!https{0,1}:\/\/)\/{0,1}(.+)\.md(#.*)?$/,
              replace: "/$1/$2",
            },
          },
          {
            resolve: "gatsby-remark-link-rewrite",
            options: {
              pattern: /^\/README\/$/,
              replace: "/",
            },
          },
          {
            resolve: "gatsby-remark-autolink-headers",
            options: {
              icon: false,
            },
          },

          {
            resolve: "gatsby-remark-external-links",
            options: {
              target: "_blank",
              rel: "noopener noreferrer",
            },
          },
          "gatsby-remark-smartypants",
        ],
      },
    },
    "gatsby-plugin-catch-links",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Technologies de l'information appliquées au journalisme",
        short_name: "EDM5240-H2019",
        start_url: "/",
        background_color: "#663399",
        theme_color: "#663399",
        display: "minimal-ui",
        // icon: "src/images/gatsby-icon.png", // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    "gatsby-plugin-offline",
  ],
}
