## JS Code Mods

This is a set of codemods built on [`jscodeshift`](https://github.com/facebook/jscodeshift) for making menial tasks and code upgrades easier. Visit the [transforms directory](./transforms) to see what's available.

## Contributing a Code Mod
Building a code mod amounts to defining a series of AST transformations. It is generally easiest to start by building a basic mod at [astexplorer.net](https://astexplorer.net/) before porting it to this repo. Refer to the `jscodeshift` [README](https://github.com/facebook/jscodeshift#readme) for instructions on creating these. Also, look at the [`tape-to-jest`](./transforms/tape-to-jest) mod for an example.

## Develop
```sh
# clone and install dependencies
git clone https://github.com/esridc/js-code-mods
cd js-code-mods
npm i
```

## Test
Run the `npm t` commmand to spin up the automated tests.