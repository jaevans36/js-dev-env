# JavaScript Development Environment

This is my JavaScript Development Environment, below is a list of everything that's used including editors to install and all services used.

# Editors and Configuration

Editor: VS Code (https://code.visualstudio.com/)  

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
  
Configuration: EditorConfig (http://editorconfig.org/)
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

Package Manager: npm (https://www.npmjs.com/)  
Package Security: Node Secuirty Platform (https://nodesecurity.io/)

```
npm install -g nsp
nsp check
```
# Development Web Server

Development Web Server: Express (https://expressjs.com/)  

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

Sharing: localtunnel (https://localtunnel.github.io/www/)
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

Automation: npm scripts (https://css-tricks.com/why-npm-scripts/)

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


