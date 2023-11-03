// @ts-check
const { join, resolve } = require('node:path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackLicensePlugin = require('webpack-license-plugin')
const preprocess = require('svelte-preprocess')

const HTML_TEMPLATE_FILE = './src/content/index.html'

const getDistFile = (file) => resolve('dist', file)
const absolutePackage = (file) => resolve('node_modules', file)

/**
 * @typedef {object} ContentFile
 * @property {string} title
 * @property {string} folder
 * @property {string} outFolder
 */

exports.default = (env, argv) => {
  const dev = argv.mode === 'development'

  return sharedSettings(
    [
      { title: 'Browser', folder: 'browser', outFolder: '' },
      { title: 'Settings', folder: 'settings', outFolder: 'settings' },
      { title: 'Bookmarks', folder: 'bookmarks', outFolder: 'bookmarks' },
      { title: 'Credits', folder: 'credits', outFolder: 'credits' },
    ],
    dev,
  )
}

/**
 * Generates a webpack config
 * @param {ContentFile[]} contentFiles The generated files
 * @param {boolean} dev If the application is in development mode
 * @returns The weback config
 */
const sharedSettings = (contentFiles, dev) => {
  const srcDir = './src/content'

  /** @type {Record<string, string>} */
  const entry = {}

  for (const contentFile of contentFiles) {
    entry[contentFile.folder] =
      './' + join(srcDir, contentFile.folder, contentFile.folder + '.ts')
  }

  return {
    name: 'Content',
    entry,
    output: {
      path: getDistFile('browser_content'),
      filename: '[name].js',
      publicPath: 'chrome://browser/content/',
      clean: true,
    },
    resolve: {
      extensions: ['.ts', '.mjs', '.js', '.svelte'],
    },

    devtool: dev ? 'inline-source-map' : 'source-map',
    devServer: {
      hot: true,
      allowedHosts: ['all'],
      devMiddleware: {
        writeToDisk: true,
      },
      client: {
        logging: 'verbose',
        overlay: false,
      },
    },
    optimization: dev
      ? {
          runtimeChunk: 'single',
        }
      : {
          runtimeChunk: 'single',
          splitChunks: {
            chunks: 'all',
          },
        },

    module: {
      rules: [
        {
          test: /\.svelte$/,
          use: {
            loader: 'svelte-loader',
            options: {
              compilerOptions: {
                dev,
              },
              emitCss: !dev,
              hotReload: dev,
              preprocess: preprocess(),
            },
          },
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            context: process.cwd(),
            configFile: resolve(process.cwd(), 'tsconfig.json'),
          },
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            dev ? 'style-loader' : MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader',
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      // new CopyPlugin({ patterns: [{ from: 'static' }] }),
      ...contentFiles.map(
        (contentFile) =>
          new HtmlWebpackPlugin({
            title: contentFile.title,
            template: HTML_TEMPLATE_FILE,
            filename: join(contentFile.outFolder, 'index.html'),
            chunks: [contentFile.folder],
          }),
      ),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new WebpackLicensePlugin({
        licenseOverrides: {
          'remixicon@3.5.0': 'Apache-2.0',
        },

        includePackages: () =>
          ['@catppuccin/palette', 'remixicon'].map(absolutePackage),

        unacceptableLicenseTest: (licenseIdentifier) =>
          ['GPL', 'AGPL', 'LGPL', 'NGPL'].includes(licenseIdentifier),
      }),
    ],

    experiments: {
      topLevelAwait: true,
    },
  }
}
