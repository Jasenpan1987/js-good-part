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
