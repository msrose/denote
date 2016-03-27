// deferred pattern

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

// Promise executor

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

// Create an immediately fulfilled or rejected promises

denote.resolve('Such a good promise').then(function(value) {
  console.log('Here it is:', value);  // logs 'Here it is: Such a good promise' with no delay
  return denote.reject(new Error('Such a bad promise'));
}).catch(function(reason) {
  console.log('Here it is not:', reason); // logs: 'Here it is not: [Error: Such a bad promise]' with no delay
});

// Wait for all promises to resolve or for one to reject

var promises = [denote.resolve('hello'), verifyEven(22), 'howdy!'];

denote.all(promises).then(function(values) {
  console.log('The results are:', values); // logs ['hello', 'The number 22 is even.', 'howdy!'] once all promises are resolved
}, function(reason) {
  console.log('One of the promises rejected:', reason); // called as soon as one of the promises is rejected
});

// Handle the first promise that completes

var morePromises = [denote.resolve('hey'), verifyEven(17), 'tra la la'];

denote.race(morePromises).then(function(winner) {
  console.log('I do declare:', winner); // logs 'I do declare: tra la la' since it fulfills before the other two complete
}, function(reason) {
  console.log('The winner rejected!', reason); // called if the first completed promise is rejected
});
