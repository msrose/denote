# Denote

A JavaScript promise library - because we don't have enough of those already.

- Micro API - only what you need
- No external dependencies
- Meets the [Promises/A+ specification](https://promisesaplus.com/).

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

```
var denote = require('denote');
var promise = denote();
```

The returned object is an instance of a `Denote` object, which is a
promise representing the future result of an asynchronous operation.

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

## Developing

```
git clone https://github.com/msrose/denote.git
cd denote
npm install
```

Before submitting a pull request, make sure that the code conforms to the
eslint configuration for this project, and that all the tests pass:

```
npm run lint && npm run test:all
```
