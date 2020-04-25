# TMD-IMFX 
Based on [Angular Webpack Starter](https://github.com/AngularClass/angular2-webpack-starter)

## Installation
```sh
# install required global dependencies
$ npm install webpack-dev-server rimraf webpack typescript angular-cli -g

# install global dependencies for install node-sass without error
$ npm install --global --production windows-build-tools

# install the repo with npm
$ npm install
```

## Start server
```sh
# development
$ npm start

# production
npm run build:prod
npm run server:prod

```

## Build files
```sh
# development
npm run build:dev
# production
npm run build:prod
```

## Run tests
```sh
npm run test
# with wathcing
npm run watch:test
```

## Run e2e tests
```sh
npm run e2e
```


## Known issues
> Problem: npm ERR! peerinvalid The package
```sh
npm ERR! Windows_NT 10.0.10586
npm ERR! argv "C:\\Program Files\\nodejs\\node.exe" "C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js" "install"
npm ERR! node v4.1.2
npm ERR! npm  v2.14.4
npm ERR! code EPEERINVALID

npm ERR! peerinvalid The package @angular/common@2.1.0 does not satisfy its siblings' peerDependencies requirements!
```
> Solution: npm must be >=3 version; node must be >=4.2.1 version
```json
  "engines": {
    "node": ">= 4.2.1",
    "npm": ">= 3"
  }
```

***

* Issues on official [repository the framework](https://github.com/AngularClass/angular2-webpack-starter/issues)