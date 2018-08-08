// Q0
// Write three binary functions (function takes 2 arguments),
// add, sub and mul that takes 2 numbers and return their sum,
// difference and product

function add(a, b) {
  return a + b;
}

function sub(a, b) {
  return a - b;
}

function mul(a, b) {
  return a * b;
}

// Q1
// Write an identityf function that takes an argument and returns
// a function which returns that argument
// var three = identityf(3)
// three() // 3

function identityf(x) {
  return function() {
    return x;
  };
}

// Q2
// write a function addf that adds from two invokations
// addf(3)(4) // 7
function addf(num1) {
  return function(num2) {
    return num1 + num2;
  };
}

// Q3
// write a function liftf that takes a binary function,
// and make it callable with two invokations.
// var addf2 = liftf(add);
// addf2(3)(4); // 7
// liftf(mul)(3)(4); // 12
function liftf(func) {
  return function(firstArg) {
    return function(secondArg) {
      return func(firstArg, secondArg);
    };
  };
}

// Q4
// write a function curry that takes a binary function and
// an argument, and returns a function that will take the
// other argument and return the result
// curry(mul, 5)(4) // 20
function curry(func, arg1) {
  return function(arg2) {
    return func(arg1, arg2);
  };
}

function curry2(func, arg1) {
  return liftf(func)(arg1);
}

// *Q4.1 currying with multiple arguments
function curryMul(func) {
  var slice = Array.prototype.slice,
    args1 = slice(arguments, 1);
  return function() {
    return func.apply(null, args1.concat(slice(arguments, 0)));
  };
}

function curryMul2(func, ...args1) {
  return function(...args2) {
    return func(...args1, ...args2);
  };
}

// Q5
