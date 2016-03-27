<a href="http://promises-aplus.github.com/promises-spec">
    <img src="http://promises-aplus.github.com/promises-spec/assets/logo-small.png"
         align="right" alt="Promises/A+ logo" />
</a>

# Denote

[![npm version](https://badge.fury.io/js/denote.svg)](https://badge.fury.io/js/denote)
[![devDependency Status](https://david-dm.org/msrose/denote/dev-status.svg)](https://david-dm.org/msrose/denote#info=devDependencies)

A JavaScript promise library - because we don't have enough of those already.

- Provides an API equivalent to the [ES2015 Promise specification](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- No external dependencies
- Meets the [Promises/A+ specification](https://promisesaplus.com/)

## Installation

```
npm install denote
```

## Example Usage

```javascript
var denote = require('denote');

function verifyParity(n) {
  var promise = denote();
  console.log('Calculating...');
  setTimeout(function() {
    if(n % 2 === 0) {
      promise.resolve('The number ' + n + ' is even!');
    } else {
      promise.reject(new Error('The number ' + n + ' is odd!'));
    }
  }, 2000);
  return promise;
}

verifyParity(14).then(function(value) {
  console.log('fulfilled', value);
  return 'llamas';
}, function(reason) {
  console.log('rejected', reason);
}).then(function(nextValue) {
  console.log('The next value is ' + nextValue);
});
```

## API

View the [online documentation](//msrose.github.io/denote).

## Contributing

```shell
git clone https://github.com/msrose/denote.git
cd denote
npm install
```

To run the project's own test suite: `npm test`

To run the [Promises/A+ compliance tests](https://github.com/promises-aplus/promises-tests): `npm run test:aplus`

Before submitting a pull request, make sure that:
- you've written tests for any new features,
- the code conforms to the eslint configuration for this project,
- and that all the tests pass

```shell
npm run lint && npm run test:all
```

## Making a Release

```shell
npm run lint
npm run test:all
git checkout develop
npm version major|minor|patch
git push origin develop
git checkout gh-pages
jsdoc --readme README.md --package package.json --destination docs denote
git add docs
git commit -m "Update docs"
git push origin gh-pages
git checkout master
git merge develop
git push origin --tags master
npm publish
```

## License

[MIT](https://github.com/msrose/denote/blob/master/LICENSE)
