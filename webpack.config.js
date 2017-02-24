var config = {
   entry: './server.js',

   output: {
      path:__dirname,
      publicPath: "/assets/",
      filename: "bundle.js"

   },
   module: {
      loaders: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
               presets: ['es2015', 'react']
            }
         }
      ]
   },
   resolve: {
    extensions: [".js", ".json", ".jsx", ".css"],
  },
   devServer: {
      inline: true,
      port: 8080,
      historyApiFallback: true,
      contentBase: './'
   }
}
module.exports = config;
