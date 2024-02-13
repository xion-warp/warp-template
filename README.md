# Warp Template

This repo contains a project template for the [Warp CLI tool](https://github.com/archway-warp/warp-cli). It is a plug-in that integrates XION into the tool. Currently, the workspace is preconfigured with a few basic functionalities that improve the user experience.

## What can you find here?

- A workspace with a `shared` crate that can serve as a convergence point between all of your contracts
- An integrated JS testing environment for you to easily write tests using `Chai` and `ts-mocha`
- A clear project structure for rapid development of smart contracts

Furthermore, when used with the `warp` command line tool, it provides a few additional quality-of-life features, like:

- Easy workspace building (debug and optimized) with just one short command: `warp build [-o]`
- Rebuilding contracts and running JS tests on a local Secret instance with a single command: `warp test [-r]`
- Quick and painless contract scaffolding with all dependencies set up automatically: `warp new <contractName>`
- Creating complex deployment scenarios for smart contracts, including a dependency hierarchy support with `warp autodeploy`

## What about frontend?

~~It is not included as of right now. I am not a frontend developer, and as such, I can't hold opinions on what's comfortable to use in the frontend world. In the future there will be options available to include various frontends through the CLI.~~

This time around it is actually possible to scaffold a frontend, if you're building a fullstack DApp -- `warp frontend`
