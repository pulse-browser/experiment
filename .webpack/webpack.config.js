// @ts-check
import { join, resolve } from 'node:path'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import preprocess from 'svelte-preprocess'

import { getDistFile } from '../.scripts/lib/constants.js'

const HTML_TEMPLATE_FILE = './src/content/index.html'

/**
 * @typedef {object} ContentFile
 * @property {string} title
 * @property {string} folder
 * @property {string} outFolder
 */

export default (env, argv) => {
  const dev = argv.mode === 'development'

  return sharedSettings(
    [
      { title: 'Browser', folder: 'browser', outFolder: '' },
      { title: 'Settings', folder: 'settings', outFolder: 'settings' },
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
      clean: true,
    },
    resolve: {
      extensions: ['.ts', '.mjs', '.js', '.svelte'],
    },

    devtool: 'inline-source-map',
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
    optimization: {
      runtimeChunk: true,
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
    ],

    experiments: {
      topLevelAwait: true,
    },
  }
}
