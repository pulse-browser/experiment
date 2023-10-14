import { getDistFile } from '../.scripts/lib/constants.js'
import { resolve } from 'node:path'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import preprocess from 'svelte-preprocess'

export default (env, argv) => {
  const dev = argv.mode === 'development'
  console.log(resolve(process.cwd(), 'tsconfig.json'))

  return [
    {
      name: 'Content',
      entry: {
        main: './src/content/main.ts',
      },
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
        new HtmlWebpackPlugin({
          title: 'SnippetMan',
          template: 'src/content/index.html',
        }),
        new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[id].css',
        }),
      ],

      experiments: {
        topLevelAwait: true,
      },
    },
  ]
}
