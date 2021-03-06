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

# Testing and Continuous Integration

1. Testing Framework: Mocha
2. Assertion Library: Chai
3. Helper Libraries: JSDOM
4. Where to run tests: Node
5. Where to place tests: Alongside
6. When to run tests: Upon save

### Setup

Create a new file in our build scripts called testSetup.js, and include the following code;
```
// This file isn't transpiled, so must use CommonJS and ES5

// Register babel to transpile before our tests run.
require('babel-register')();

// Disable webpack features that Mocha doesn't understand.
require.extensions['.css'] = function() {};
```
In our package.json include the following lines in scripts;
```
"test": "mocha --reporter progress buildScripts/testSetup.js \"src/**/*.test.js\"",
"test:watch": "npm run test -- --watch"
```
Then update our start script so that it now should look like this;
```
"start": "npm-run-all --parallel security-check open:src lint:watch test:watch",
```
To test this out with some example tests, create a new test file called index.test.js (For testing our index files), then add the following;
```
import {expect} from 'chai';
import jsdom from 'jsdom';
import fs from 'fs';

// Example tests - testing that it's working
describe('Our first test', () => {
  it('should pass', () => {
    expect(true).to.equal(true);
  });
});

// Example tests - testing DOM elements
describe('index.html', () => {
  it('should say hello', (done) => {
    const index = fs.readFileSync('./src/index.html', "utf-8");
    jsdom.env(index, function(err, window) {
      const h1 = window.document.getElementsByTagName('h1')[0];
      expect(h1.innerHTML).to.equal("Hello World!");
      done();
      window.close();
    });
  })
})
```
The first test is a simple script to test that it's working, the second is to test for a h1 element with the content for 'Hello World!'.

### Continuous integration

Testing to see if any committed changes have broken the build on the CI Server. The CI servers I'll be using are;
1. Travis (Linux, Mac) - https://travis-ci.org/
2. Appveyor (Windows) - https://www.appveyor.com/

#### Travis setup

1. Log in to https://travis-ci.org (If not signed up, sign in with github - which will sync your account with Travis)
2. In your account, enable the repository you want to use with travis (you can change settings using the gear to the right if needed)
3. Create a new file in our main project directory called .travis.yml and add the following code;
```
language: node_js
node_js:
  - "6"
```
Now, whenever you commit changes for this repository to github, it will test our build for errors in our tests.

#### Appveyor setup

1. Sign up to https://www.appveyor.com/ (again it will allow you to sign up with your github account - using the appropriate plan)
2. Once approved and in your account, add a new project then select the project in github
3. Create a new file in the project route folder called appveyor.yml and add the following code;
```
# Test against this version of Node.js
environment:
  matrix:
    # node.js
    - nodejs_version: "6"

# Install scripts. (runs after repo cloning)
  install:
    # Get the latest stable version of Node.js or io.js
    - ps: Install-Product node $env:nodejs_version
    # install modules
    - npm install

# Post-install test scripts.
test_script:
  # Output useful info for debugging.
  - node --version
  - npm --version
  # run tests
  - npm test

# Don't actually build.
build: off
```

# Centralising HTTP Requests

Add the following code to our srcServer.js for our current Express set up
```
app.get('/users', function(req, res) {
  // Hard coding for simplicity. Pretend this hits a real database, this would normally be the response from a database or server
  res.json([
    {"id": 1,"firstName":"Jay","lastName":"Evans","email":"jaymail@gmail.com"},
    {"id": 2,"firstName":"Jade","lastName":"Evans","email":"jademail@gmail.com"},
    {"id": 3,"firstName":"David","lastName":"Evans","email":"davidmail@gmail.com"}
  ]);
});
```
Starting our app and using /users at the end of our URL, should return all the users being called from our instance above.

Next create a new folder in our src folder called 'api', this will centralise all our api calls. Within this folder create a new file called 'userApi.js', and include the following code;
```
import 'whatwg-fetch';

export function getUsers() {
  return get('users');
}

function get(url) {
  return fetch(url).then(onSuccess, onError);
}

function onSuccess(response) {
  return response.json();
}

function onError(error) {
  console.log(error); // eslint-disable-line no-console
}
```
To test this, we can mock up some javascript to post user information on the page, see the following files for a working example of this;
* userApi.js
* index.html
* index.js
* index.test.js

### Mocking HTTP

We'll be using the following to help set up our mock http data;
1. Schema - JSON Schema Faker
    * http://json-schema.org/
    * https://github.com/json-schema-faker/json-schema-faker
    * https://github.com/typicode/json-server
2. Random data generators:
    * faker.js 
      * https://github.com/marak/Faker.js/wiki
      * http://marak.github.io/faker.js/index.html 
      * https://rawgit.com/Marak/faker.js/master/examples/browser/index.html)
    * chance.js
      * http://chancejs.com/
    * randexp.js
      * http://fent.github.io/randexp.js/
3. Server Data via API - JSON Server

#### Setup

1. Creat a new file called mockDataSchema.js in our buildScripts folder, and add the following code to is;
```
export const schema = {
  "type": "object",
  "properties": {
    "users": {
      "type": "array",
      "minItems": 3,
      "maxItems": 5,
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "number",
            "unique": true,
            "minimum": 1
          },
          "firstName": {
            "type": "string",
            "faker": "name.firstName"
          },
          "lastName": {
            "type": "string",
            "faker": "name.lastName"
          },
          "email": {
            "type": "string",
            "faker": "internet.email"
          }
        },
        required: ['id', 'firstName', 'lastName', 'email']
      }
    }
  },
  required: ['users']
};
```
2. Create another file in buildScripts called 'generateMockData.js', and include the following code;
```
/* eslint-disable no-console */

import jsf from 'json-schema-faker';
import {schema} from './mockDataSchema';
import fs from 'fs';
import chalk from 'chalk';

const json = JSON.stringify(jsf(schema));

fs.writeFile("./src/api/db.json", json, function (err) {
  if (err) {
    return console.log(chalk.red(err));
  } else {
    console.log(chalk.green("Mock data generated."));
  }
});
```
3. Add a new line to the package.json, to make it easy to run our generated  
(note: we used babel-node again as the generated is written with ES6)
```
"generate-mock-data": "babel-node buildScripts/generateMockData"
```
If you now run the following command in the terminal, you will see that the data is generated in our api folder as a new file called db.json
```
npm run generate-mock-data
```
4. Next add a new line to our script files, this will set up a json-server to make the generated db accessible
```
"start-mockapi": "json-server --watch src/api/db.json --port 3001"
```
Now if we run the following command, we will see that it will give you a URL in the terminal from which you can access the json data
```
npm run start-mockapi
```
To ensure that the data is random each time we run it, place the following line before our 'start-mockapi', in scripts and add 'start-mockapi' to our start script;
```
"prestart-mockapi": "npm run generate-mock-data",
```
So that our scripts should now look like this;
```
  "scripts": {
    "prestart": "babel-node buildScripts/startMessage.js",
    "start": "npm-run-all --parallel security-check open:src lint:watch test:watch start-mockapi",
    "open:src": "babel-node buildScripts/srcServer.js",
    "lint": "esw webpack.config.* src buildScripts --color",
    "lint:watch": "npm run lint -- --watch",
    "security-check": "nsp check",
    "localtunnel": "lt --port 3000",
    "share": "npm-run-all --parallel open:src localtunnel",
    "test": "mocha --reporter progress buildScripts/testSetup.js \"src/**/*.test.js\"",
    "test:watch": "npm run test -- --watch",
    "generate-mock-data": "babel-node buildScripts/generateMockData",
    "prestart-mockapi": "npm run generate-mock-data",
    "start-mockapi": "json-server --watch src/api/db.json --port 3001"
  },
```
5. Next we need to change our application so that it can use this data. Create a new file in our src/api folder called 'baseUrl.js', and include the following code;
```
export default function getBaseUrl() {
  const inDevelopment = window.location.hostname === 'localhost';
  return inDevelopment ? 'http://localhost:3001/' : '/';
}
```
Then update our userApi.js so that it should now look like this;
```
import 'whatwg-fetch';
import getBaseUrl from './baseUrl';

const baseUrl = getBaseUrl();

// export allows this to be a public function
export function getUsers() {
  return get('users');
}

function get(url) {
  return fetch(baseUrl + url).then(onSuccess, onError);
}

function onSuccess(response) {
  return response.json();
}

function onError(error) {
  console.log(error); // eslint-disable-line no-console
}
```
6. Next we will update our UI so that we can manipulate the data in our API, firstly we'll need to open u p the userApi.js and add in the following function;
```
export function deleteUser(id) {
  return del(`users/${id}`);
}

// Can't call func delete since reserved word.
function del(url) {
  const request = new Request(baseUrl + url, {
    method: 'DELETE'
  });

  return fetch(request).then(onSuccess, onError);
}
```
Then update our index.js so that it looks like this;
```
import './index.css';
import {getUsers, deleteUser} from './api/userApi';

// Populate table of users via API call.
getUsers().then(result => {
  let usersBody = "";

  result.forEach(user => {
    usersBody+= `<tr>
      <td><a href="#" data-id="${user.id}" class="deleteUser">Delete</a></td>
      <td>${user.id}</td>
      <td>${user.firstName}</td>
      <td>${user.lastName}</td>
      <td>${user.email}</td>
      </tr>`
  });

  global.document.getElementById('users').innerHTML = usersBody;

  const deleteLinks = global.document.getElementsByClassName('deleteUser');

  // Must use array.from to create a real array from a DOM collection
  // getElementsByClassName only returns an "array like" object
  Array.from(deleteLinks, link => {
    link.onclick = function(event) {
      const element = event.target;
      event.preventDefault();
      deleteUser(element.attributes["data-id"].value);
      const row = element.parentNode.parentNode;
      row.parentNode.removeChild(row);
    };
  });
});
```
# Making our environment production ready

Update our webpack.config.dev.js file so that it includes the following code;
```
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

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
  plugins: [
    // Create HTML file that includes reference to bundled JS.
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: true
    })
  ],
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel']},
      {test: /\.css$/, loaders: ['style','css']}
    ]
  }
}
```

Duplicate webpack.config.dev.js and rename it to 'webpack.config.prod.js' and fill with the following code;
```
import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  debug: true,
  devtool: 'source-map',
  noInfo: false,
  entry: [
    path.resolve(__dirname, 'src/index')
  ],
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugin: [
    // Create HTML file that includes reference to bundled JS.
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: true
    }),
    // Eliminate duplicate packages when generating bundle
    new webpack.optimize.DedupePlugin(),
    // Minify JS
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        minimize: true
      }
    })
  ],
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel']},
      {test: /\.css$/, loaders: ['style', 'css']}
    ]
  }
}
```
Do the same with the srcServer and rename it to 'distServer.js' and fill with the following code;
```
import express from 'express';
import path from 'path';
import open from 'open';
import compression from 'compression';

/* eslint-disable no-console */

const port = 3000;
const app = express();

app.use(compression()); // This is not for actual production, but is useful for hosting the minified production build locally for debugging
app.use(express.static('dist'));

app.get('/', function (req, res){
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.get('/users', function(req, res) {
  // Hard coding for simplicity. Pretend this hits a real/production database
  res.json([
    {"id": 1,"firstName":"Jay","lastName":"Evans","email":"jaymail@gmail.com"},
    {"id": 2,"firstName":"Jade","lastName":"Evans","email":"jademail@gmail.com"},
    {"id": 3,"firstName":"David","lastName":"Evans","email":"davidmail@gmail.com"}
  ]);
});

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    open('http://localhost:' + port);
  }
});
```
Next change the content of our 'baseUrl.js' in src/api to the following;
```
export default function getBaseUrl() {
  return getQueryStringParameterByName('useMockApi') ? 'http://localhost:3001/' : '/';
}

/* This function should make it easier for us to switch between
   real and mockapi during development by just adding
   '/?useMockApi=true' to the query string.
*/
function getQueryStringParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return;
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
```
Finally we need to update the package.json scripts to look as follows;
```
  "scripts": {
    "prestart": "babel-node buildScripts/startMessage.js",
    "start": "npm-run-all --parallel security-check open:src lint:watch test:watch start-mockapi",
    "open:src": "babel-node buildScripts/srcServer.js",
    "lint": "esw webpack.config.* src buildScripts --color",
    "lint:watch": "npm run lint -- --watch",
    "security-check": "nsp check",
    "localtunnel": "lt --port 3000",
    "share": "npm-run-all --parallel open:src localtunnel",
    "test": "mocha --reporter progress buildScripts/testSetup.js \"src/**/*.test.js\"",
    "test:watch": "npm run test -- --watch",
    "generate-mock-data": "babel-node buildScripts/generateMockData",
    "prestart-mockapi": "npm run generate-mock-data",
    "start-mockapi": "json-server --watch src/api/db.json --port 3001",
    "clean-dist": "rimraf ./dist && mkdir dist",
    "prebuild": "npm-run-all clean-dist test lint",
    "build": "babel-node buildScripts/build.js",
    "postbuild": "babel-node buildScripts/distServer.js"
  },
```
The command we use to run the build is;
```
npm run build -s
```
Which will also run the prebuild and postbuild scripts as described, and clean-dist will clear any existing code from the folder before building our production app.
