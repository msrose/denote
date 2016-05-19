<a href="http://promises-aplus.github.com/promises-spec">
    <img src="http://promises-aplus.github.com/promises-spec/assets/logo-small.png"
         align="right" alt="Promises/A+ logo" />
</a>

# Denote

[![npm version](https://badge.fury.io/js/denote.svg)](https://badge.fury.io/js/denote)
[![devDependency Status](https://david-dm.org/msrose/denote/dev-status.svg)](https://david-dm.org/msrose/denote#info=devDependencies)

[API Documentation](http://msrose.github.io/denote)

A JavaScript promise library - because we don't have enough of those already.

- No external dependencies
- Provides equivalent API methods to the [ES2015 Promise specification](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- Meets the [Promises/A+ specification](https://promisesaplus.com/)

## Installation

```shell
npm install denote
```

## Example Usage

```javascript
var denote = require('denote');

```

### Using deferred promise creation

```javascript
function verifyEven(n) {
  var promise = denote();
  setTimeout(function() {
    if(n % 2 === 0) {
      promise.resolve('The number ' + n + ' is even.');
    } else {
      promise.reject(new Error('The number ' + n + ' is odd.'));
    }
  }, 1000);
  return promise;
}

verifyEven(14).then(function(value) {
  console.log('fulfilled', value);  // logs 'fulfilled The number 14 is even.' after 1s
  return verifyEven(27);
}, function(reason) {
  console.log('rejected', reason);  // does not run
}).catch(function(reason) {
  console.log('rejected', reason);  // logs 'rejected [Error: The number 27 is odd.]' after 2s
});
```

### Using an executor function

```javascript
denote(function(resolve, reject) {
  setTimeout(resolve, 1000, 'llamas');
}).then(function(value) {
  console.log('The value is', value); // logs 'The value is llamas' after 1s
  return denote(function(resolve, reject) {
    setTimeout(reject, 1000, new Error('There are no llamas'))
  });
}).catch(function(reason) {
  console.log('The reason is', reason); // logs 'The reaons is [Error: There are no llamas]' after 2s
});
```

### Creating immediately fulfilled or rejected promises

```javascript
denote.resolve('Such a good promise').then(function(value) {
  console.log('Here it is:', value);  // logs 'Here it is: Such a good promise' with no delay
  return denote.reject(new Error('Such a bad promise'));
}).catch(function(reason) {
  console.log('Here it is not:', reason); // logs: 'Here it is not: [Error: Such a bad promise]' with no delay
});
```

### Using `denote.all` to handle many promises

```javascript
var promises = [denote.resolve('hello'), verifyEven(22), 'howdy!'];

denote.all(promises).then(function(values) {
  console.log('The results are:', values); // logs ['hello', 'The number 22 is even.', 'howdy!'] once all promises are resolved
}, function(reason) {
  console.log('One of the promises rejected:', reason); // called as soon as one of the promises is rejected
});
```

### Using `denote.race` to handle the first promise to complete

```javascript
var morePromises = [denote.resolve('hey'), verifyEven(17), 'tra la la'];

denote.race(morePromises).then(function(winner) {
  console.log('I do declare:', winner); // logs 'I do declare: tra la la' since it fulfills before the other two complete
}, function(reason) {
  console.log('The winner rejected!', reason); // called if the first completed promise is rejected
});
```

## API

View the [online documentation](http://msrose.github.io/denote) for details.

### `denote = require('denote')`

- `denote([executor])` - returns a new Denote promise instance
- `denote.resolve(value)`
- `denote.reject(reason)`
- `denote.all(list)`
- `denote.race(list)`

### `Denote.prototype`

- `Denote.prototype.then(onFulfilled, onRejected)`
- `Denote.prototype.catch(onRejected)`
- `Denote.prototype.resolve(value)`
- `Denote.prototype.reject(reason)`

## Contributing

```shell
git clone https://github.com/msrose/denote.git
cd denote
npm install
```

To run the project's own test suite: `npm run test:mocha`

To run the [Promises/A+ compliance tests](https://github.com/promises-aplus/promises-tests): `npm run test:aplus`

Before submitting a pull request, make sure that:
- you've written tests for any new features,
- the code conforms to the eslint configuration for this project,
- and that all the tests pass

```shell
npm run lint && npm test
```

## Making a Release

```shell
npm run lint
npm test
git checkout develop
npm version major|minor|patch
git push origin develop
git checkout gh-pages
git merge develop
jsdoc -c jsdoc.conf.json -R README.md -P package.json
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
