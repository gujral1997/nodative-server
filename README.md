# nodative-server
Shifted nodative server to new repository because of deplopment issues


## Steps to setup the node project independently with es2015

1. `mkdir server`
2. `cd server`
3. `yarn init`
4. `yarn add express`
5. `yarn add --dev babel-cli babel-preset-es2015 babel-preset-stage-2 nodemon`
6. Copy the following in `package.json`

```
"scripts": {
    "start": "nodemon index.js --exec babel-node --presets  es2015,stage-2"
  }

```

## Steps to setup the node project (assuming node.js is pre-installed in your system)

1. `git clone https://github.com/gujral1997/nodative-server`
2. `cd nodative server`
3. `npm install -g yarn nodemon`
4. `yarn`
5. `nodemon start`
