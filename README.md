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
Package Manager: npm (https://www.npmjs.com/)  
Package Security: Node Secuirty Platform (https://nodesecurity.io/)

```
npm install -g nsp
nsp check
```
