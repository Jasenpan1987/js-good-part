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
// use the exist functions, create the inc function
// var inc = _ _ _;
// inc(5) // 6
// inc(inc(5)) // 6
var inc = curry(add, 1);
var inc2 = liftf(add)(1);
var inc3 = addf(1);

// Q6
// write a function twice, that takes a binary function
// and returns a unary function that passes its argument
// twice to the binary function
// add(11, 11) // 22
// var double = twice(add);
// double(11) // 22
function twice(binaryFunc) {
  return function(arg) {
    return binaryFunc(arg, arg);
  };
}

var doubl = twice(add); // will be used later
var sqr = twice(mul); // will be used later

// Q7
// write reverse, a function that reverses the arguments
// of a binary function
// var reversedSub = reverse(sub);
// reversedSub(5, 1) // -4
function reverse(func) {
  return function(arg1, arg2) {
    return func(arg2, arg1);
  };
}

function reverse2(func) {
  return function(...args) {
    return func(...args.reverse());
  };
}

// Q8
// write a function composeu that takes two unary functions
// and returns a unary function that call them both
// var doublAndSqr = composeu(doubl, sqr)
// doublAndSqr(5) // 100
function composeu(func1, func2) {
  return function(arg) {
    return func2(func1(arg));
  };
}

// Q9
// write a function composeb that takes two binary functions
// and returns a function that call them both
// composeb(add, mul)(2, 3, 7) // 35
function composeb(func1, func2) {
  return function(arg1, arg2, arg3) {
    return func2(func1(arg1, arg2), arg3);
  };
}

// Q10
// write a limit function that allows a binary function
// to be called a limit number of times
// var addLimit1 = limit(add, 1)
// addLimit1(1, 2); // 3
// addLimit1(3, 5); // undefined
function limit(binaryFunc, times) {
  var calledCount = 0;
  return function(arg1, arg2) {
    calledCount += 1;
    if (calledCount <= times) {
      return binaryFunc(arg1, arg2);
    }
    return undefined;
  };
}
