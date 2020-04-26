# Type Spliter
Smart utility for binary filetype association.

## If syntax

### b[offset]
Read signed byte.

```js
b[0] == -25
```

### ub[offset]
Read unsigned byte.

```js
ub[0] == 32
```

### i[offset]
Read signed integer.

```js
i[0] == -40
```

### u[offset]
Read unsigned integer.

```js
u[0] == 40
```

### s[offset, end_offset]
Read UTF8 string.

```js
s[0, 5] == 'Hello'
```
