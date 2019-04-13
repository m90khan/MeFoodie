/* jshint esversion: 6 */
/* jshint esversion: 8 */
//webpack has 4 core concepts
// entry point / output / loaders / plugins
//in webpack4 we have two modules . development (no minification ) and  production (all kind of optimization)


//Loaders: to load all kinds of files and convert them . es6 to es5 etc.
//instal html plugin to copy the html file to dist fodler

//node package
const path = require('path');
//html plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports ={
  //where it shoudl starts bundling
  // './' dot means current folder
  entry: ['babel-polyfill','./src/js/index.js'],
  // where to save the bundles
  //path to the folder and the filename


output: {
  //path has to be an absolute path and for that need a node package
  path: path.resolve(__dirname, 'dist'),  //__dirname is current absoluet path (wordking directory foodme) with the one we want to bundle in (dist)
 //as it was not making live changes because path was specified as dist/js. so same output and dev as dist to reflect changes.
  filename: 'js/bundle.js' //standard name
},
//to configure live dev-server
//
devServer :{
  //contentbase : from where we get the files
  //src folder is for dev dist is for client
  //then we add script in package.json folder with START which emans that it will kepp running in the background. --open means that it will keep
  contentBase: './dist'
  //
},
//plugin receives an array of all plugins
plugins: [
  // new is like funct constructor

  // new HtmlWebpackPlugin({
  //        template: resolve(__dirname, 'src/', 'index.html'),
  //        filename: './index.html'
  //      }),
new HtmlWebpackPlugin({
  //using object to pass options
  //in general : each time we are bundling js files. also copy html files and include the script
  filename: 'index.html', //standard name
  template: './src/index.html' // starter html file
})],
//babel . use module then pass object in which ruules are given
module:{
  rules:[
    {
      test : /\.js$/,     //test all the js files use (regular expression / /)
    exclude: /node_modules/, //exclude the folder

      //all those js files will use babel loader
      use:{
        loader: 'babel-loader'
      }
    }
  ]
}
};
