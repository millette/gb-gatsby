const defaultConfig = require("./gb-config.sample.json")

let config

try {
  const userConfig = require("./content/gb-config.json")
  config = {
    siteMetadata: {
      ...defaultConfig.siteMetadata,
      ...userConfig.siteMetadata,
    },
    manifest: {
      ...defaultConfig.manifest,
      ...userConfig.manifest,
    },
  }
} catch (e) {
  config = defaultConfig
}

const pathPrefix = "/gb-gatsby" // or '/'

module.exports = {
  pathPrefix,
  siteMetadata: {
    ...config.siteMetadata,
  },
  plugins: [
    "gatsby-plugin-no-sourcemaps",
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "miscdocs",
        path: `${__dirname}/content`,
        ignore: ["**/.git"],
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
              // pattern: /^(?!https{0,1}:\/\/)\/(?gb-gatsby\/)(.+)\.md(#.*)?$/,
              // pattern: /^(?!https{0,1}:\/\/)\/{0,1}(?:gb-gatsby\/){0,1}(.+)\.md(#.*)?$/,
              // pattern: new RegExp(`^(?!https{0,1}:\\/\\/)\\/{0,1}(?:${pathPrefix}\\/){0,1}(.+)\\.md(#.*)?\$`),
              pattern: new RegExp(
                `^(?!https{0,1}:\\/\\/)(?:${pathPrefix}\\/){0,1}(.+)\\.md(#.*)?\$`
              ),
              replace: `${pathPrefix}/$1/$2`,
            },
          },
          {
            resolve: "gatsby-remark-link-rewrite",
            options: {
              // pattern: /^\/README\/$/,
              pattern: new RegExp(`^${pathPrefix}\/README\/$`),
              replace: `${pathPrefix}/`,
              // replace: "/",
            },
          },
          /*
          {
            resolve: "gatsby-remark-link-rewrite",
            options: {
              pattern: /^\/(.*)$/,
              replace: `${pathPrefix}/$1`,
            },
          },
          */
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
          {
            resolve: "gatsby-remark-copy-linked-files",
            options: {
              destinationDir: "assets",
              ignoreFileExtensions: ["png", "jpg", "jpeg"],
            },
          },
        ],
      },
    },
    "gatsby-plugin-catch-links",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        ...config.manifest,
        start_url: `${pathPrefix}/`,
      },
    },
    // To learn more, visit: https://gatsby.app/offline
    "gatsby-plugin-offline",
  ],
}
