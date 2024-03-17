/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
// @ts-check
import { preprocessMeltUI } from '@melt-ui/pp'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { join, resolve } from 'node:path'
import preprocess from 'svelte-preprocess'
import sequence from 'svelte-sequential-preprocessor'
import WebpackLicensePlugin from 'webpack-license-plugin'

const HTML_TEMPLATE_FILE = './src/index.html'

const absolutePackage = (file) => resolve('node_modules', file)

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
      { title: 'Bookmarks', folder: 'bookmarks', outFolder: 'bookmarks' },
      { title: 'History', folder: 'history', outFolder: 'history' },
      { title: 'Credits', folder: 'credits', outFolder: 'credits' },
      { title: 'Test runner', folder: 'tests', outFolder: 'tests' },
    ],
    dev,
  )
}

/**
 * Generates a webpack config
 * @param {ContentFile[]} contentFiles The generated files
 * @param {boolean} dev If the application is in development mode
 * @returns {import('webpack').Configuration} The weback config
 */
const sharedSettings = (contentFiles, dev) => {
  const srcDir = './src'

  /** @type {Record<string, string>} */
  const entry = {}

  for (const contentFile of contentFiles) {
    entry[contentFile.folder] =
      './' + join(srcDir, contentFile.folder, contentFile.folder + '.js')
  }

  return {
    name: 'Content',
    entry,
    output: {
      path: resolve('dist'),
      filename: '[name].js',
      publicPath: 'chrome://browser/content/',
      clean: true,
    },
    resolve: {
      extensions: ['.ts', '.mjs', '.js', '.svelte'],
      alias: {
        '@shared': resolve('src/shared'),
        '@browser': resolve('src/browser'),
      },
      mainFields: ['svelte', 'browser', 'module', 'main'],
      conditionNames: ['svelte', 'browser', 'import'],
    },
    resolveLoader: {
      modules: ['node_modules'],
      extensions: ['.js', '.json'],
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
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
      },
    },
    stats: 'minimal',

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
              preprocess: sequence([preprocess(), preprocessMeltUI()]),
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
        {
          test: /\.txt$/,
          type: 'asset/source',
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
          'remixicon@3.7.0': 'Apache-2.0',
        },

        includePackages: () =>
          ['@catppuccin/palette', 'remixicon'].map(absolutePackage),

        unacceptableLicenseTest: (licenseIdentifier) =>
          ['GPL', 'AGPL', 'LGPL', 'NGPL'].includes(licenseIdentifier),
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'static',
          },
        ],
      }),
    ].filter(Boolean),

    experiments: {
      topLevelAwait: true,
    },
  }
}
