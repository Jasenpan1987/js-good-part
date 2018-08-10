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

// Q11
// write a from function that produces a generator that will
// produce a series of values
// var index = from(0)
// index() // 1
// index() // 2
function from(start) {
  return function() {
    var next = start;
    start += 1;
    return next;
  };
}

// Q12
// write a to function that takes a generator and an end value
// and will produce a generator that produce up to that limit
// var index = to(from(1), 3)
// index() // 1
// index() // 2
// index() // undefined
function to(gen, limit) {
  return function() {
    var result = gen();
    if (result < limit) {
      return result;
    }
    return undefined;
  };
}

// Q13
// write a fromTo function that produce a generator that will
// produce a value in a range
// var index = fromTo(0, 3);
// index() // 0
// index() // 1
// index() // 2
// index() // undefined
function fromTo(start, end) {
  return function() {
    var next = start;
    start += 1;
    if (next < end) {
      return next;
    }
    return undefined;
  };
}

function fromTo2(start, end) {
  return to(from(start), end);
}

// Q14
// write an element function that takes an array and a
// generator that will produce elements from the array
// var elem = element(["a", "b", "c"], from(1, 3))
// elem() // "b"
// elem() // "c"
// elem() // undefined
function element(arr, gen) {
  return function() {
    var idx = gen();

    return idx || idx === 0 ? arr[idx] : undefined;
  };
}

// Q15
// modify the element function, so the generator function is
// optional. If the generator is not provided, each element
// of the array will be produced
// var elem = element(["a", "b"])
// elem() // "a"
// elem() // "b"
// elem() // undefined
function element(arr, gen) {
  // gen = (gen && typeof gen === "function") || fromTo(0, arr.length); // bad
  if (!gen || typeof gen !== "function") {
    // always be explicit, easier to read and modify
    gen = fromTo(0, arr.length);
  }

  return function() {
    var idx = gen();
    return idx || idx == 0 ? arr[idx] : undefined;
  };
}

// Q16
// write a collect function that takes a generator and an array and produce a
// function that will collect the result in the array
// var arr = [];
// var col = collect(fromTo(0, 2), arr);
// col() // 0
// col() // 1
// col() // undefined
// arr // [0, 1]
function collect(gen, arr) {
  return function() {
    var value = gen();
    if (value !== undefined) {
      arr.push(value);
    }
    return value;
  };
}

// Q17
// write a filter function, that takes a generator and a predicate and produce a
// generator that only return the values that passes the predicate function
// var fil = filter(fromTo(0, 5), function third(val) {
//   return val % 3 === 0;
// });
// fil() // 0
// fil() // 3
// fil() // undefined
function filter(gen, predicate) {
  return function exec(val) {
    var value = gen();
    if (value === undefined || predicate(value)) {
      return value;
    }
    value = exec(value);

    return value;
  };
}

function filter2(gen, predicate) {
  return function() {
    var value;
    do {
      value = gen();
    } while (value !== undefined && predicate(value));
    return value;
  };
}

function filter3(gen, predicate) {
  return function recur() {
    var value = gen();
    if (value === undefined || predicate(value)) {
      return value;
    }

    return recur();
  };
}

// Q18
// write a concat function that takes two generators and produce a generator
// which combines the two generator in sequence
// var con = concat(fromTo(0, 3), fromTo(0, 2))
// con() // 0
// con() // 1
// con() // 2
// con() // 0
// con() // 1
// con() // undefined
function concat(gen1, gen2) {
  var gen = gen1;
  return function() {
    var value = gen();
    if (value !== undefined) {
      gen = gen2;
      value = gen();
    }
    return value;
  };
}

// *Q18.1
// write concatMulti that takes any number of generators and
// perform the same action like the concat
function concatMulti() {
  var gens = Array.prototype.slice.call(arguments, 0);
  var nextGen = element(gens);
  var gen = nextGen();

  return function recur() {
    if (gen !== undefined) {
      var value = gen();
      if (value === undefined) {
        gen = nextGen();
        if (gen !== undefined) {
          return recur();
        }
      }
      return value;
    }
    return undefined;
  };
}

// Q19
// write a function gensymf that makes a function that generates
// unique symbols
// var geng = gensymf("G")
// geng() // "G1"
// geng() // "G2"
// var genh = gensymf("H")
// genh() // "H1"
// genh() // "H2"
function gensymf(sym) {
  var gen = from(1);
  return function() {
    return sym + "" + gen();
  };
}

// Q20
// write a function fibonaccif that returns a generator that
// will keep generate the next fibonacci number
// var fib = fibonaccif()
// fib(); // 0
// fib(); // 1
// fib(); // 1
// fib(); // 2
// fib(); // 3
// fib(); // 5
// fib(); // 8
function fibonaccif(num1, num2) {
  return function() {
    var next = num1;
    num1 = num2;
    num2 += next;
    return next;
  };
}

// Q21
// write a function that returns an object that implements
// an up/down counter, hiding the counter
// var obj = counter(10)
// var up = obj.up
// var down = obj.down
// up() // 11
// up() // 12
// down() // 11
function counter(start) {
  var ctr = start;
  return {
    up: function() {
      ctr += 1;
      return ctr;
    },
    down: function() {
      ctr -= 1;
      return ctr;
    }
  };
}

// Q22
// make a revocable function that takes a binary function,
// and returns an object containing an invoke function that
// can invoke the binary function, and a revoke function that
// disable the invoke function
// var rev = revocable(add);
// var addInv = rev.invoke;
// addInv(3, 4) // 7
// rev.revoke()
// addInv(6, 2) // undefined
function revocable(binaryFunc) {
  var isInvocable = true;
  return {
    invoke: function() {
      var args = Array.prototype.slice.call(arguments, 0);
      if (isInvocable) {
        return binaryFunc.apply(null, args);
      }
      return undefined;
    },
    revoke: function() {
      isInvocable = false;
    }
  };
}

function revocable2(binaryFunc) {
  var func = binaryFunc;
  return {
    invoke: function() {
      if (typeof func === "function") {
        var args = Array.prototype.slice.call(arguments, 0);
        return func.apply(null, args);
      }
      return undefined;
    },
    revoke: function() {
      func = undefined;
    }
  };
}

// Q23
// write a function m that takes a value and an optional source string
// and returns them in an object
// m(1) // { value: 1, source: "1" }
// m(Math.PI, "pi") // { value: 3.141592..., source: "pi" }
function m(value, source) {
  if (source === undefined) {
    source = value;
  }

  return {
    value: value,
    source: typeof source === "string" ? source : String(source)
  };
}

// Q24
// write a function addm that add two m objects and returns an m object
// addm(m(3), m(4)) // { value: 7, source: "(3 + 4)" }
// addm(m(3, "foo"), m(4, "bar")) // { value: 7, source: "(foo + bar)" }
function addm(m1, m2) {
  return m(m1.value + m2.value, "(" + m1.source + " + " + m2.source + ")");
}

// Q25
// write a function liftm that takes a binary function and a string and
// returns a function that act as m objects.
// var addlfm = liftm(add, "+")
// addlfm(m(3), m(4)) // { value: 7, source: '(3 + 4)' }
// var mullfm = liftm(mul, "*")
// mullfm(m(3), m(4)) // { value: 7, source: '(3 * 4)' }
function liftm2(binaryFunc, str) {
  return function(m1, m2) {
    return m(
      binaryFunc(m1.value, m2.value),
      "(" + m1.source + " " + str + " " + m2.source + ")"
    );
  };
}

// Q26
// modify liftm so that the function it produces can take either
// numbers or m objects
// var addlfm = liftm(add, "+")
// addlfm(3, 4) // { value: 7, source: '(3 + 4)' }
function liftm(binaryFunc, str) {
  function checkM(m) {
    return m.value !== undefined && typeof m.source === "string";
  }
  return function(m1, m2) {
    if (!checkM(m1)) {
      m1 = m(m1);
    }
    if (!checkM(m2)) {
      m2 = m(m2);
    }

    return m(
      binaryFunc(m1.value, m2.value),
      "(" + m1.source + " " + str + " " + m2.source + ")"
    );
  };
}

// Q27
// write an exp function that evaluate simple array expressions
// var sae = [mul, 3, 4]
// exp(sae) // 12
// exp(3) // 3
function exp(arr) {
  if (Array.isArray(arr)) {
    return arr[0](arr[1], arr[2]);
  }
  return arr;
}

// *Q27.1
// modify the exp function that it can take nested array expressions
// var nae = exp([Math.sqrt, [add, [add, 4, 12], [sqr, 3]]]); // 5
function exp(arrOrValue) {
  if (Array.isArray(arrOrValue)) {
    return arrOrValue[0](exp(arrOrValue[1]), exp(arrOrValue[2]));
  }
  return arrOrValue;
}

// Q28
// write a function addg that adds from many invokations until it sees
// an empty invokation
// addg() // undefined
// addg(2)() // 2
// addg(3)(4)() // 7
// addg(5)(6)(2)() // 13
function addg(num) {
  var sum = num;
  if (num === undefined) {
    return undefined;
  }
  return function addToSum(x) {
    if (x !== undefined) {
      num += x;
      return addToSum;
    }
    return sum;
  };
}

// Q29
// write a liftg function that will take a binary function
// and apply it to many arguments
// liftg(mul)() // undefined
// liftg(mul)(3)() // 3
// liftg(mul)(3)(4)() // 12
// liftg(mul)(3)(0)(4)() // 0
function liftg(op) {
  var result;

  return function fun1(x) {
    if (x === undefined) {
      return undefined;
    }
    result = x;
    return function run2(y) {
      if (y === undefined) {
        return result === x ? x : result;
      }
      result = op(result, y);
      return run2;
    };
  };
}

// Q30
// write a function arrayg that will build an array
// from many invocations
// arrayg() // []
// arrayg(3)() // [3]
// arrayg(4)(6)() // [4, 6]
function arrayg(first) {
  var arr = [];
  function more(next) {
    if (next === undefined) {
      return arr;
    }
    arr.push(next);
    more(next);
  }
  return more(first);
}

// Q31
// write a function continuize, that takes a unary function
// and returns a function that takes a callback and an argument
// var sqrtc = continuize(Math.sqrt);
// sqrtc(console.log, 81);
function continuize(func) {
  return function(cb, num) {
    return cb(func(num));
  };
}
var sqrtc = continuize(Math.sqrt);
sqrtc(console.log, 81);

// *Q30.1
// modify the continuize function that the function it returns
// can take multiple arguments
function continuize(func) {
  return function(cb, ...args) {
    return cb(func(...args));
  };
}
