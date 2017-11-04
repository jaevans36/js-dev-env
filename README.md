# JavaScript Development Environment

This is my JavaScript Development Environment, below is a list of everything that's used including editors to install and all services used.

# Editors and Configuration

### Editor: VS Code (https://code.visualstudio.com/)  

Pluggins:  
* CSS Peek (1.3.1)  
* Debugger for Chrome (3.4.0)  
* EditorConfig for VS Code (0.11.1)  
* Git Lens (5.7.1)  
* Guides (0.9.0)  
* HTML Snippets (0.1.0)  
* Instant Markdown (1.3.0)  
* IntelliSense for CSS class names (1.12.0)  
* Trailing Spaces (0.2.11)  
* VSCode Great Icons (2.1.19)  
* Path Intellisense (1.4.2)  
* Open in browser (1.1.0)    
  
### Configuration: EditorConfig (http://editorconfig.org/)
```
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```  
# Package managers and Security

### Package Manager: npm (https://www.npmjs.com/)  
```
npm install -g nsp
```

### Package Security: Node Secuirty Platform (https://nodesecurity.io/)
```
nsp check
```
# Development Web Server

### Development Web Server: Express (https://expressjs.com/)  

1. Create a new folder called 'buildScripts'
2. In the folder create a js file called 'srcServer.js'
3. In the main directory, create another folder called 'src'
4. In 'src' create your starter index.html file, with some boilerplate HTML
5. In the js file, add the following;

```
var express = require('express');
var path = require('path');
var open = require('open');

var port = 3000;
var app = express();

app.get('/', function (req, res){
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    open('http://localhost:' + port);
  }
})
```

6. Run the following script in terminal - which will start the server and open up the index.html file in your browser.

```
node buildScripts/srcServer.js
```
Note: The above line is used to run it directly, however this will be made easier later, using npm scripts under automation.

# Sharing solution

### Sharing: localtunnel (https://localtunnel.github.io/www/)
```
npm install localtunnel -g
lt --port 3000
```

If you'd like to choose a subdomain, to make it easier for your client to access the page, use the following;
```
lt --port 3000 --subdomain subDomainName
```

Note: Browsersync can be used along side this option, and will share the functionality with localtunnel

# Automation

### Automation: npm scripts (https://css-tricks.com/why-npm-scripts/)

As a start, to make running the Express server easier, use the following script in package.json
```
  "scripts": {
    "start": "node buildScripts/srcServer.js"
  },
```
After doing this we will be able to use the following terminal command, to run our development server;
```
npm start
```
To add a helpful message to help us when our development environment is starting up;  
1. Create a new file in our buildScripts folder called 'startMessage.js'
2. Add the following into the file  
(note: 'chalk' is a plugin that allows you to change the colour of the message);
```
var chalk = require('chalk');

console.log(chalk.green('Starting the app in dev mdoe...'));
```
3. Add the following to our package.json 'scripts', which should now look like this  
(note: any scripts that you prefix with 'pre' will run before the script with the same name - post will do the same but following the script name);
```
  "scripts": {
    "prestart": "node buildScripts/startMessage.js",
    "start": "node buildScripts/srcServer.js"
  },
```
Now when we use 'npm start' it will display our message before the server starts.

Updating the scripts to add further automation, and to run the scripts we want to on start;  
(note: to run share, you will need to use the command 'npm run share')
```
  "scripts": {
    "prestart": "node buildScripts/startMessage.js",
    "start": "npm-run-all --parallel security-check open:src",
    "open:src": "node buildScripts/srcServer.js",
    "security-check": "nsp check",
    "localtunnel": "lt --port 3000",
    "share": "npm-run-all --parallel open:src localtunnel"
  },
```
As we've added more, the following command will allow us to start up without additional noise that we're not interested in;
```
npm start -s
```
# Transpiling

### Transpiler: Babel

Create a new file in the main directory of your app, called '.babelrc', in this file include the following code;  
(note: this will tell your app to use the latest version of JavaScript)
```
{
  "presets": [
    "latest"
  ]
}

```
With Babel running we can now change our package.json to transpile using Babel, so our scripts should now look as follows;
```
  "scripts": {
    "prestart": "babel-node buildScripts/startMessage.js",
    "start": "npm-run-all --parallel security-check open:src",
    "open:src": "babel-node buildScripts/srcServer.js",
    "security-check": "nsp check",
    "localtunnel": "lt --port 3000",
    "share": "npm-run-all --parallel open:src localtunnel"
  },
```
To test that this is working, we can change the scripts to use a newer version of JavaScript, by using the 'const' keyword etc.

# Bundler

### Bundler: Webpack

Create a new file at the route of your folder called 'webpack.config.dev.js'. Then add the following code into the file;
```
import path from 'path';

export default {
  debug: true,
  devtool: 'inline-source-map',
  noInfo: false,
  entry: [
    path.resolve(__dirname, 'src/index')
  ],
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'src'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugin: [],
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel']},
      {test: /\.css$/, loaders: ['style', 'css']}
    ]
  }
}
```
Next, update express to use webpack, update srcServer.js so that it should now look like this;
```
import express from 'express';
import path from 'path';
import open from 'open';
import webpack from 'webpack';
import config from '../webpack.config.dev';

const port = 3000;
const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.get('/', function (req, res){
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    open('http://localhost:' + port);
  }
});

```
Now that webpack is set up to bundle all our js and css, it's as simple as creating and using the javascript in our project src folder. Another neat thing we can do is to include our css files in our js, and have it injected into the page, using the following line, in our js file;
```
import './index.css';
```
With this set up, it may make it more difficult to debug, however the solution for this is to use sourcemaps. As we've already told our webpack to use 'inline-source-map' we're part way there to setting this up already.  
(note: there are different settings to sourcemaps we can use, which can be found here - http://webpack.github.io/docs/configuration.html#devtool also note that higher quality sourcemaps will take longer to load)

Using the following code in our js file, will allow us to access the specific file where it's placed, which allows us to debug our code without seeing the full transpiled code.
```
debugger;
```
# Linting

### Linter: ESLint

First create a new file in the main app directory called '.eslintrc.json' and add the following code.
```
{
  "root": true,
  "extends": [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings"
  ],
  "parserOptions": {
    "ecmaVersion": 7,
    "sourceType": "module"
  },
  "env": {
    "browser": true,
    "node": true,
    "mocha": true
  },
  "rules": {
    "no-console": 1
  }
}
```
Next add the following to our package.json scripts
```
"lint": "esw webpack.config.* src buildScripts --color"
```
As this will now error for any console.log, we can add the following line into any js file we want to ignore eslint.
```
/* eslint-disable no-console */
```
Or if we want it to be disabled on a single line, use this example;
```
console.log(chalk.green('Starting the app in dev mode...')); // eslint-disable-line no-console
```
Use the following command to run the linting process;
```
npm run lint
```
What's done above won't watch our app automatically, to do that add the following code to package.json;
```
"lint:watch": "npm run lint -- --watch"
```
Then to get it watching the file, use the following in the terminal;
```
npm run lint:watch
```
Final thing to do is to add lint:watch to our package.json start script.
