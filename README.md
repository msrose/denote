<a href="https://promisesaplus.com/" style="float:right">
  ![Promises/A+ logo](https://promisesaplus.com/assets/logo-small.png)
</a>

# Denote

A JavaScript promise library - because we don't have enough of those already.

- Micro API - only what you need
- No external dependencies
- Meets the [Promises/A+ specification](https://promisesaplus.com/)

## Installation

```
npm install denote
```

## Example Usage

```js
var denote = require('denote');

function createPromise(n) {
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

createPromise(14).then(function(value) {
  console.log('fulfilled', value);
  return 'llamas';
}, function(reason) {
  console.log('rejected', reason);
}).then(function(nextValue) {
  console.log('The next value is ' + nextValue);
});
```

## API

Create a new promise object:

### require('denote')

A function that creates a new instance of a Denote promise.
For example:

```
var denote = require('denote');
var promise = denote();
```

#### Parameters

None

#### Return Value

A function that when called returns a new instance of a `Denote` object,
which is a promise representing the future result of an asynchronous operation.

### Denote.prototype.then(onFulfilled, onRejected)

Registers two callbacks to the asynchronous operation that will be conditionally
executed based upon its result.

#### Parameters

`onFulfilled`: a `function` that will be called if the operation succeeds,
with the first argument as the result of the operation

`onRejected`: a `function` that will be called if the operation fails,
with the first argument as the reason for the failure

#### Return Value

A new instance of a `Denote` promise object

### Denote.prototype.resolve(value)

To be called when the asynchronous operation succeeds.

#### Parameters

`value`: the result of the asynchronous operation success

#### Return Value

`undefined`

### Denote.prototype.reject(reason)

To be called when the asynchronous operation fails.

#### Parameters

`reason`: the reason for the failure of the asynchronous operation

#### Return Value

`undefined`

## Contributing

```
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

```
npm run lint && npm run test:all
```
