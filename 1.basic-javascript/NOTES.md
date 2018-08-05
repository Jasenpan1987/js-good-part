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
