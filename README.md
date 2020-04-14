# Fake-Exe

Create your fake executable to hide an application behind another.
Fake-exe allows to create a binary file of a main application that hides inside javascript code that it will be run in detached mode.

## Use 
```bash
 npm install -g fake-exe
```
![](other/how-to-use.gif)

### Notes:
- The javascript code must be inside a package.
- The main application is not compiled inside the binary file, then relatives path between the main application and the binary generated does not have to change.

