const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const HtmlBeautifyPlugin  = require("html-beautify-webpack-plugin");
const path = require('path');
const PUBLIC_PATH = path.join(__dirname, 'public');
const SRC_PATH = path.join(__dirname, 'src');

module.exports = (env, argv) => ({
    mode: 'development',
  entry: './src/index.ts',
    output: {
        path: PUBLIC_PATH,
        filename: 'index.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.json', '.scss', ".js"],
    },
    module: {

        rules: [
            {
              test: /\.tsx|ts$/,
                exclude: /node_modules/,
              use: [{ loader: 'ts-loader', options: { onlyCompileBundledFiles: true } }],
            },
            {
                test: /\.scss$/,
                use: [
                    argv.mode === 'production' ? MiniCssExtractPlugin.loader : "style-loader",
                    {
                        loader: 'css-loader',
                        options: {
                            // sourceMap: true,
                          // modules: true,
                          // localIdentName: '[name]__[local]__[hash:base64:5]',
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: argv.mode === 'production' ? [
                                require('autoprefixer')('last 2 versions', 'Safari >= 9', 'ie >= 11', 'ff >= 40', 'Chrome >= 40', 'iOS >= 9'),
                                require('cssnano')(),
                            ] : [],
                        },
                    },
                    // 'resolve-url-loader',
                    "sass-loader",
                ]
            },
            {
                test: /\.(png|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(SRC_PATH, 'index.html')
        }),
        // new HtmlBeautifyPlugin(),
    ],
    devServer: {
        contentBase: PUBLIC_PATH,
        compress: true,
    },
});