# 1. Object

## 1.1 Get Set and Delete

```js
// Get
object.name;
object[expression];

// Set
object.name = value;
object[expression] = value;

// Delete
delete object.name;
delete object[expression];
```

- the `key` must by string.

# 1.2 Class vs Prototypes

```
parent
--------
|a | 1 |
|b | 2 |
|      | -> Object.prototype
--------

var child = Object.create(parent);

child
--------
|  |   | -> parent.prototype
--------
```

- When retrieve values from the child, it will see if it has the property, if not, it will go to the object it `inherited from` and see if it has the property and keep searching up.

- When set values to the child, it will just add to it, no search up.

```
child.c = 3

child
--------
|c | 3 |
|  |   | -> parent.prototype
--------
```

# 2. Numbers

**In javascript there is only one number type which is number, but it was the wrong one (double).**

## 2.1 Flaws

```js
var a = 0.1,
  b = 0.2,
  c = 0.3;

a + b === c; //false

a + b + c === a + (b + c); // false
```

## 2.2 Numbers are objects

Because numbers are objects, there are methods that we can call on a number

```js
toFixed
toLocaleString
toString
typeOf
...
```

## 2.3 Add methods on the `Number` prototype

```js
if (!Number.prototype.trunc) {
  Number.prototype.trunc = function trunc(number) {
    return number >= 0 ? Math.floor(number) : Math.ceil(number);
  };
}
```

Because numbers are objects, so we can add new methods to its prototype and all numbers can call this methods afterwards.

## 2.4 NaN

- NaN is a special number and it's not a number.
- Results of undefined or erroneous operations.
- Toxic: any arithmetic operation with NaN as the input will return NaN.
- NaN is not equal to anything including NaN.
- isNaN is the way to check if a number is NaN.

# 3. Array

Array in javascript is Object.

## 3.1 Array literal

```js
var mylist = ["foo", "bar"];

// append array
mylist[mylist.length] = "baz";
```

## 3.2 Delete array elements

```js
var arr = [1, 2, 3, 4];
delete arr[1];
// the result will be [1, undefined, 3, 4]

arr.splice(1, 1); // [1,3,4];
```

## 3.3 Falsy values

- null
- false
- undefined
- 0
- ""
- NaN

# 4. Statement

## 4.1 throw

```js
throw new Error(reason);

throw 1;

throw {
  errorCode: 1,
  message: "not right"
};
```

In javascript, you can literally throw any value.

# 5. functions

## 5.1 function expression

- Produces an instance of funtion object
- Functions are first class
  - may be passed as an argument to another function
  - may be returned from a function
  - may assign to a variable
  - may be stored in an object or an array
- function objects inherit from `function.prototype`

## 5.2 function statement

- function
- mandatory names
- parameters
  - wrapped in parens
  - zero or more names
  - saperated by ,
- body
  - wrapped in curly braces
  - zero or more statements

**Tips: don't declear a function inside an if statement.**

if the first token of a statement is `function`, otherwise it is a function decleration.

### 5.2.1 scope

Function creates scope just like the block scope.

```js
function assure_positive(matrix, n) {
  for (var i = 0; i < n; i += 1) {
    var row = matrix[i];
    for (var i = 0; i < row.length; i += 1) {
      if (row[i] < 0) {
        throw new Error("Negative");
      }
    }
  }
}
```

This is a very bad example, because when it get executed, all the `var i` will hoisted to the top and becomes to 1 `var i`, then all the var assignment is actually assigned to the same variable i.

```js
// this is how the javascript engine see this code

function assure_positive(matrix, n) {
  var i;
  var i; // get ignored
  var row;
  for (i = 0; i < n; i += 1) {
    row = matrix[i];
    // this will re-assign i to zero.
    for (i = 0; i < row.length; i += 1) {
      if (row[i] < 0) {
        throw new Error("Negative");
      }
    }
  }
}
```

**Tips: always declear the variable on the top of a scope.**

## 5.3 function best practice

### 5.3.1 return statement

- return an expression or `return`
- if there is no return statment in a function, then the return value is undefined
- except for constructor functions, which will return `this`

### 5.3.2 don't make functions in a loop

- it can be wasteful because a new function object is created in every iteration.
- it can be confusing because the newly created function closes over the loop's variables, not over its current value.

```js
// wrong, no matter which id you click you will always get the last id
for (var i...) {
  div_id = divs[i].id; // it captured the last one
  divs[i].onclick = function() {
    alert(div_id)
  }
}
```

```js
// correct
divs.forEach(function(div) {
  div.onClick = function() {
    alert(div.id);
  };
});
```

### 5.3.3 arguments

- when a function gets invoked, in addtion to its parameters, it gets a special parameter called `arguments`
- it contains all the arguments from the invokation
- it's an array liked object
- `arguments.length` will give you the number of arguments passed into the function
- Weired interaction with parameters

example

```js
function sum() {
  var i,
    n = arguments.length,
    total = 0;

  for (i = 0; i < n; i += 1) {
    total += arguments[i];
  }
  return total;
}

sum(1, 2, 3, 4, 5);
```

### 5.3.4 this

- the `this` parameter contains a reference to the object of invokation
- `this` allows a method to know what object it is concerned with
- `this` allows a single function object to service many objects
- `this` is the key to prototype inheritance

1.  If we call a function

`thisObject.methodName(arguments)`

or

`thisObject[methodName](arguments)`

- the `this` is set to `thisObject`, the object that contains the function.
- `this` will allow the function to have a reference of the `thisObject` of interest

2.  If we call a function:
    `functionObject(arguments)`

- `this` will set to the `global / window` object, `undefined` in strict mode
- an inner function does not get access to the outer `this`

3.  If we call a function:`new FunctionValue(arguments)`

- a new object will be created and assigned to `this`
- if there is no explicit return value, `this` will be returned
- used in the pseudoClassical style

4.  If we call a function

`functionObject.apply(thisObject, argumentsArray)`

or

`functionObject.apply(thisObject, argument...)`

- `this` will set to `thisObject`

```js
function factorial(n) {
  var result = 1,
    currentNum = n;
  while (currentNum > 1) {
    result *= currentNum;
    result -= 1;
  }

  return result;
}
```

```js
function factorial(n) {
  var currentNum = n;
  return (function(result) {
    while (currentNum > 1) {
      result *= currentNum;
      currentNum -= 1;
    }
    return result;
  })(1);
}
```

## 5.4 Closure

example 1

This is bad, because `name` is a global variable, may cause conflicts.

```js
var names = ["one", "two", "three"];

var digitName = function(n) {
  return names[n];
};
```

Better, no naming conflict, but every time we call `digitName`, we create the `names` array.

```js
var digitName = function(n) {
  var names = ["one", "two", "three"];
  return names[n];
};
```

Good! The outer function returns a function and wraps the `names` inside it, and the inner function can reference it.

```js
var digitName = (function() {
  var names = ["one", "two", "three"];
  return function(n) {
    return names[n];
  };
})();
```

example 2

This is a good implementation because each time we call `fade`, there won't be any conflict since the `dom` and `level` variable are captured inside the `fade` function.

```js
function fade(id) {
  var dom = document.getElementById(id),
    level = 1;

  function step() {
    var h = level.toString(16);
    dom.style.backgroundColor = "#FFFF" + h + h;
    if (level < 15) {
      level += 1;
      setTimeout(step, 100);
    }
  }

  setTimeout(step, 100);
}
```

## 5.5 PseudoClassical

### 5.5.1 What does the `new` prefix operator do?

It does something like this:

```js
Function.prototype.new = function new() {
  var that = Object.create(this.prototype),
    result = this.apply(that, arguments);

  return (
    typeof result === "object" && result !== null
  ) ? result : that;
}

function Student(id) {
  this.id = id;
}

Student.prototype.study = function() {
  console.log("Student " + this.id + " is studying");
}

var student1 = Student.new(1);
```

### 5.5.2 Pseudo Classical Inheritance

```js
function Foo(id) {
  this.id = id;
}

Foo.prototype.greet = function() {
  console.log("Hello, from Foo");
};

Foo.prototype.eat = function() {
  console.log("Eating");
};

function Bar(id, name) {
  this.id = id;
  this.name = name;
}

Bar.prototype = new Foo();

Bar.prototype.drink = function() {
  console.log("drinking");
};

Bar.prototype.greet = function() {
  console.log("Hello, from Bar");
};

Bar.prototype.constructor = Bar;

var foo = new Foo(1);
var bar = new Bar(2, "BAR");
```

## 5.6 Module Pattern

**Javascript is NOT a classical language, so try to NOT use `new`**

```js
var singleton = (function(){
  var privateVars;
  function privateFunc() {
    ...
  }

  return {
    firstMethod: function(x) {
      privateVars...
      privateFunc(x)
    },
    secondMethod: function(a, b) {
      privateVars...
      privateFunc(a, b)
    }
  }
}());
```

**Tips: if a function has more than 2 arguments, pass an object rather than individual arguments**

- Name of the variables can be preserved
- Can directly use JSON returned from an api as the argument

## 5.6 Prototypal vs Functional

rewrite the `Foo`, `Bar` to functional

```js
function foo(id) {
  return {
    id: id,
    toString: function() {
      return "Foo " + this.id;
    }
  };
}

function bar(id, name) {
  var that = foo(id);
  that.name = name;
  that.test = function(testId) {
    return testId === id;
  };

  return that;
}
```

**Tips: The drawback of this method is it takes more memory than the prototypal inheritance**

# 6. Html and Javascript

## 6.1 Advise to use javascript on page

- use `<script src="...">` tag instead of plain `<script></script>` tags, because it can be cached and can be gzipped.
- don't use `document.write` because it create security vonerbility and it interupt the page load.
- always put the `<script>` tags on the bottom of the body, because the page don't have to wait until all the javascipt loaded and execute.
- always use gzipped and concatenated script files to reduce the number and payload of the http request.

## 6.2 DOM tree structure

```html
<html>
  <body>
    <h1>Hello</h1>
    <p>Hello world</p>
  </body>
</html>
```

will be translated into (IE6 tree)

```
- #document      ===> document
-- html          ===> document.documentElement
---- head
---- body        ===> document.body
-------- h1
------------ #text
-------- p
------------ #text
```

- each node has pointers to other nodes, for example `h1` has `firstChild` and `lastChild` pointing to the `#text` and there are sibling pointers, `p` has `previousSibling` pointing to `h1` and `h1` has `nextSibling` pointing to `p`.

```js
function walkTheDOM(node, func) {
  func(node);
  node = node.firstChild;
  while (node) {
    walkTheDOM(node, func);
    node = node.nextSibling;
  }
}
```

## 6.3 Retrieving node

- `document.getElementById(id)`
- `document.getElementsName(name)`
- `node.getElementsByTagName(tagName)`

Once you have the node, you can manipulate the DOM node by

- modifying the attributes:
  `img.src = "foo.png"`
- changing the style of the DOM node:
  `div.className = "foo"` or `div.style.backgroundColor = "red"`

Css and DOM has different naming convensions:

- `background-color` vs `backgroundColor`
- `font-size` vs `fontSize`
- `z-index` vs `zIndex`
- `float` vs `cssFloat`
  ...

And also, we can make new node

- `document.createElement(tagName)`
- `document.createTextNode(text)`
- `div.cloneNode()` will give you an individual node div element
- `div.cloneNode(true)` will clone a div node and everything inside the div

**The cloned nodes are not attached to the document**

And we can link them by using

- `node.appendChild(newNode)`
- `node.insertBefore(newNode, sibling)`
- `node.replaceChild(newNode, oldNode)`
- `oldNode.parentNode.replaceChild(newNode, oldNode)`

And also we can remove node

- `node.removeChild(oldNode)`
- `oldNode.parent.removeChild(oldNode)`
  - It returns you the removed node
  - Remember to also remove the eventHandlers attached to the node

## 6.4 innerHTML vs DOM insertion

- innerHTML create security issues
- DOM insertion is slower and sometimes harder to maintain.

## 6.5 Events

### 6.5.1 Add event listener to DOM

- Netscape `node["on" + type] = func`
- Microsoft `node.attachEvent("on" + type, func)`
- W3C `node.addEventListener(type, func, false)`

### 6.5.2 Trickling and Bubbling

- Trickling is an event capturing pattern which provides compatibility with the Netscape 4 model, **avoid it!**
- Bubbling means the event is given to the target, and then its parent, and then its parent, and so on until the event is cancelled.

- Cancel Bubbling
  - `e.stopPorpagation()`

**Tips: DOM is very bad designed, so use any library to manipulate the DOM rather than manipulate the DOM directly.**

# 7. ES5

## 7.1 New Syntax

### 7.1.1 trailing commas

- In es5, array and object literals can have trailing commas, and it can compute the length property correctly (use to be a bug in IE6).

### 7.1.2 reserved word

- In es5, you can use reserved words in object literals like this without errors

```js
var obj = {
  return: true,
  class: "foo",
  float: "left"
};

obj.return; // true
```

### 7.1.3 getters and setters

```js
function person() {
  var firstName = "Foo";
  var lastName = "Bar";
  return {
    get fullname() {
      return firstName + " " + lastName;
    },
    set fullname(name) {
      firstName = name.split(" ")[0];
      lastName = name.split(" ")[1];
    }
  };
}

var p = person;
p.fullname; // "Foo Bar"
p.fullname = "John Doe";
p.fullname; // "John Doe"
```

**Tips: don't do unnecessary stuff in getter and setters**

### 7.1.4 Constants (use to be global variables)

- Infinity
- NaN
- undefined

**And now you can't change them anymore, and that fixed a lot of security issues.**

## 7.2 New methods

- `Function.prototype.bind`
- `String.prototype.trim`
- `Array.prototype.isArray`
- `Array.prototype.every`
- `Array.prototype.filter`
- `Array.prototype.forEach`
- `Array.prototype.indexOf`
- `Array.prototype.lastIndexOf`
- `Array.prototype.map`
- `Array.prototype.reduce`
- `Array.prototype.reduceRight`
- `Array.prototype.some`
- `Date.prototype.now` Now 100% accurate, sometimes got latency
- `Date.prototype.toISOString` based on UTC time
- `Object.prototype.keys` only get the data members
- `Object.prototype.create`

## 7.3 Meta object API

Object has two types of properties:

- Data properties
- Accessor properties (getter and setter)

Each attribute has the following properties:

- value: any js values
- writable: boolean
- enumerable: boolean
- configurable: boolean
- get (only for accessor properties)
- set (only for accessor properties)

```js
// the two obj are exactly the same
var obj = { foo: "bar" };
var obj = Object.create(Object.prototype);
Object.defineProperty(obj, "foo", {
  value: "bar",
  writable: true,
  enumerable: true,
  configurable: true
});
```

### 7.3.1 Meta API

- `Object.defineProperty(obj, key, descriptor)`
- `Object.defineProperties(obj, objOfDescriptors)`
- `Object.getOwnPropertyDescriptor(obj, key)`
- `Object.getOwnPropertyNames(obj)`
- `Object.preventExtensions(obj)`
- `Object.seal(obj)`
- `Object.freeze(obj)` creates immutable objects
- `Object.isExtensible(obj)`
- `Object.isSealed(obj)`
- `Object.isFrozen(obj)`

```js
function replacePrototype(object, prototype) {
  var result = Object.create(prototype);
  Object.getOwnPropertyNames.forEach(
    function(key) {
      Object.defineProperty(
        result,
        key,
        Object.getOwnPropertyDescriptor(object, key);
      );
    }
  );
  return result;
}
```

## 7.4 Strict Mode

- 'use strict'
  - file form: the first statement in a file
  - function form: the first statement in a function (only use this on browser code because of the file concatenation)

The following functions can tell you if you are currently in strict mode

```js
function inStrictMode() {
  return (function() {
    return !this;
  })();
}

function strictModeImplemented() {
  return (function() {
    "use strict";
    return !this;
  })();
}
```

# \*Promise Study Notes

```js
function fakeAPI1() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("foo1");
    }, 1000);
  });
}

function fakeAPI2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("foo2");
    }, 2000);
  });
}

function fakeAPI3() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("foo3");
    }, 3000);
  });
}
async function getAPI() {
  const foo = fakeAPI3();
  console.log(await foo);
  const foo2 = fakeAPI2();
  console.log(await foo2);
  const foo3 = fakeAPI1();
  console.log(await foo3);
}

async function getAPI2() {
  const [foo, foo2, foo3] = await Promise.all([
    fakeAPI1(),
    fakeAPI2(),
    fakeAPI3()
  ]);
  console.log(foo);
  console.log(foo2);
  console.log(foo3);
}

async function getAPI3() {
  let getApis = [fakeAPI3, fakeAPI2, fakeAPI1];

  for (let fakeApi of getApis) {
    fakeApi().then(console.log);
  }
}

function resolvePromisesParalle(promiseArr) {
  const results = [];
  for (let promise of promiseArr) {
    results.push(
      promise()
        .then(x => x)
        .catch(err => {
          undefined;
        })
    );
  }
  return results;
}

// Promise.all with fallback value
function allWithFallback(promiseArr, placeHolder) {
  const newPromiseArr = promiseArr.map(p =>
    p.catch(err => {
      if (typeof placeHolder !== "function") {
        return placeHolder;
      }
      return placeHolder(err);
    })
  );
  return Promise.all(newPromiseArr);
}

// how to use
allWithFallback([fakeAPI3(), fakeAPI2(), fakeAPI1()]); // ["foo", undefined, "foo3"]

allWithFallback([fakeAPI3(), fakeAPI2(), fakeAPI1(), "placeholder"] // ["foo", "placeholder", "foo3"]

allWithFallback([fakeAPI3(), fakeAPI2(), fakeAPI1(), err => err === "foo2" ? "FOO2" : "placeholder"]// ["foo", "FOO2", "foo3"]

// have the same behavior with Promise.all
allWithFallback([fakeAPI3(), fakeAPI2(), fakeAPI1()], x => {
  throw x + " --";
})
  .then(apis => console.log(apis))
  .catch(err => {
    console.log("err:: ", err);
  });
```

## 7.5 A "Hacking" Exercise

Given that you have the following method implementation, but somehow it got a security vulnerability. Suppose `_arr` is a private variable, and you don't want people to access it, and the only way you can `set` and `get` the elements from the `_arr` is by calling the interface that the return value from `vector` exposes.

How can I get the entire `_arr` by calling the interfaces?

```js
function vector() {
  var _arr = [];
  return {
    append: function(value) {
      _arr.push(value);
    },
    store: function(index, value) {
      _arr[index] = value;
    },
    get: function(index) {
      return _arr[index];
    }
  };
}
```

**hint1: the array methods can also be accessed by calling arr["concat"]**

**hint2: you can only access the array inside the function**

### Solution:

```js
var myVector = vector();
myVector.append(7);
myVector.store(1, 8);
// [7, 8]
var stash;
myVector.store("push", function() {
  stash = this;
});
myVector.append();
console.log(stash);
```

This example exposes two vulnerability of the javascript language:

- 1.  there is no acutal `Array` defined in this language, array in javascript is defined as an `Object`, so that the index `i` doesn't have to be an integer, it can be anything.
- 2.  the binding of a function is defined dynamically, and `this` is defined when the function getting called rather than when the function is defined.

### Correction

```js
function vector() {
  var _arr = [];
  return {
    append: function(value) {
      _arr[_arr.length] = value;
    },
    store: function(index, value) {
      _arr[+index] = value;
    },
    get: function(index) {
      return _arr[+index];
    }
  };
}
```

## 7.6 Another "Hacking" Exercise

Make a function that makes a publish/subscribe object.
It will reliably deliver all publication to all the subscribers in the correct order.

```js
// var myPubSub = pubsub();
// myPubSub.subscribe(log);
// myPubSub.publish("It works"); // log("It works")
```

```js
function pubsub() {
  var _subscribers = [];
  return {
    subscribe: function(callback) {
      _subscribers.push(callback);
    },
    publish: function(message) {
      var idx = 0,
        len = _subscribers.length;
      for (; idx < len; idx += 1) {
        _subscribers[idx](message);
      }
    }
  };
}
```

The solution exposes a couple of vulnerabilities and we will fix them one by one

### hack 1: Break the code

```js
var myPubSub = pubsub();
myPubSub.subscribe();
myPubSub.subscribe(x => console.log("sub4::", x));
myPubSub.subscribe(x => console.log("sub5::", x));
myPubSub.publish("It works");
```

The subscribers will not be able to get called during the publish because the first subscription has an error.

### Fix 1:

```js
function pubsub() {
  var _subscribers = [];
  return {
    subscribe: function(callback) {
      _subscribers.push(callback);
    },
    publish: function(message) {
      var idx = 0,
        len = _subscribers.length;
      for (; idx < len; idx += 1) {
        try {
          _subscribers[idx](message);
        } catch (ignore) {}
      }
    }
  };
}
```

### hack 2: change the publish method

```js
myPubSub.publish = undefined;
myPubSub.publish("It works");
```

by setting the publish method to `undefined` or something else, the publish call will causing errors or undesired behaviors.

### Fix 2:

```js
function pubsub() {
  var _subscribers = [];
  return Object.freeze({
    subscribe: function(callback) {
      _subscribers.push(callback);
    },
    publish: function(message) {
      var idx = 0,
        len = _subscribers.length;
      for (; idx < len; idx += 1) {
        try {
          _subscribers[idx](message);
        } catch (ignore) {}
      }
    }
  });
}
```

### hack 3: get the reference to the `_subscribers` array and modify it.

```js
var myPubSub = pubsub();

myPubSub.subscribe(function(x) {
  console.log("sub1::", x);
});

myPubSub.subscribe(function() {
  // this.length = 0; // attack 1: none of the subscriber will receive the message
  // attack 2: all the later subscribers will run the function the attacker defined
  for (var i = 0; i < this.length; i += 1) {
    this[i] = function(x) {
      console.log("haha now you subscribe to me!");
    };
  }
});

myPubSub.subscribe(function(x) {
  console.log("sub2::", x);
});

myPubSub.subscribe(function(x) {
  console.log("sub3::", x);
});

myPubSub.publish("hello");
```

### Fix 3:

```js
function pubsub() {
  var _subscribers = [];
  var _isPublishing = false;
  return Object.freeze({
    subscribe: function(callback) {
      _subscribers.push(callback);
    },
    publish: function(message) {
      // now we avoid using index to iterate the _subscribers
      _isPublishing = true;
      _subscribers.forEach(function(s) {
        try {
          s(message);
        } catch (ignore) {}
      });
      _isPublishing = false;
    }
  });
}
```

### hack 4: changing the order of the message

```js
var myPubSub = pubsub();

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

myPubSub.subscribe(function(x) {
  console.log("sub1::", x);
});

myPubSub.subscribe(
  limit(function() {
    myPubSub.publish("Out of order");
  }, 1)
);

myPubSub.subscribe(function(x) {
  console.log("sub2::", x);
});

myPubSub.subscribe(function(x) {
  console.log("sub3::", x);
});

myPubSub.publish("hurry");
```

### Fix 4

```js
fix;
function pubsub() {
  var _subscribers = [];
  return Object.freeze({
    subscribe: function(callback) {
      _subscribers.push(callback);
    },
    publish: function(message) {
      // now we avoid using index to iterate the _subscribers
      _subscribers.forEach(function(s) {
        try {
          setTimeout(function() {
            s(message);
          }, 0);
        } catch (ignore) {}
      });
    }
  });
}
```

# 8. Async funcions

## 8.1 Threading

Pros:

- No rethinking is required
- Blocking programs are ok
- Execution is continued as long as any thread is not blocked

Cons:

- Stack memory per thread
- If two or more thread uses the same memory, a race may occur

## 8.2 Event loop

Pros:

- Completely free of races and deadlocks
- Only one stack
- Very low overhead
- If a turn failed, the program can still run

Cons:

- Programs must never block
- Turn must finishes quickly
- Programs are inside out

## 8.3 Test async functions

`assert(message, expect, actual)` pattern won't work for async functions.

Insead, we use the "Quick check" patt from the Haskell comunity.

### 8.3.1 JSCheck

- case generation
- testing over turns
- `JSC.claim(name, predicate, signature)`
- `JSC.check(milliseconds)`
- `JSC.on_report(callback)`
- `JSC.on_error(callback)`

# 9. Javascript the better part

## 9.1 New ES6 good features

### 9.1.1 Tail calls

`return func();`

- runs faster
- less memory
- compiler support

### 9.1.2 Ellipsis

```js
function curry(func, ...first) {
  return function(...second) {
    return func(...first, ...second);
  };
}
```

Is much more concise than

```js
function curry(func) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    return func.apply(
      null,
      args.concat(Array.prototype.slice.call(arguments, 0))
    );
  };
}
```

### 9.1.3 Modules

```js
import React from "react";
```

### 9.1.4 let and const

- let gives javascript variables block scope
- const is NOT equal to Object.freeze()

### 9.1.5 Destructuring

- `let {foo, bar} = myObj;`
- easier and cleaner

### 9.1.6 WeakMap

- it is what Object should be
- more memory efficient
- better garbagge collection

### 9.1.7 Arraow functions

```js
name => ({ id: name }); // add () if you want to return an object
```

## 9.2 Class Free classical inheritance

```js
function constructor(spec) {
  let { member } = spec;
  let { other } = other_constructor(spec);
  let method = function() {
    // member, other member, method, spec
  };
  return Object.freeze({
    method,
    other
  });
}
```
