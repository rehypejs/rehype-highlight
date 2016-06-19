# rehype-highlight [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

<!--lint disable heading-increment list-item-spacing-->

Syntax highlighting for [**rehype**][rehype].

## Installation

[npm][npm-install]:

```bash
npm install rehype-highlight
```

## Usage

Dependencies:

```javascript
var rehype = require('rehype');
var highlight = require('rehype-highlight');
```

Transform:

```javascript
var file = rehype().use(highlight).process([
    '<h1>Hello World!</h1>',
    '',
    '<pre><code class="language-js">var name = "World";',
    'console.warn("Hello, " + name + "!")</code></pre>'
].join('\n'));
```

Yields:

```html
<h1>Hello World!</h1>

<pre><code class="hljs language-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">&#x22;World&#x22;</span>;
<span class="hljs-built_in">console</span>.warn(<span class="hljs-string">&#x22;Hello, &#x22;</span> + name + <span class="hljs-string">&#x22;!&#x22;</span>)</code></pre>
```

## API

### `rehype.use(highlight[, options])`

Syntax highlight `pre > code`.  Uses [**lowlight**][lowlight] under
the hood, which is a virtual version of [`highlight.js`][highlight-js].

Configure the language by using a `lang-js` or `language-js` class.
Ignore `code` with a `no-highlight` or `nohighlight` class.
Will auto-detect the syntax language otherwise.

###### `options`

*   `prefix` (`string`, default: 'hljs-')
    — Prefix to use before classes;
*   `subset` (`boolean` or `Array.<string>`, default: all languages)
    — Scope of languages to check when auto-detecting.
    Pass `false` to not highlight code without language classes.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/rehype-highlight.svg

[travis]: https://travis-ci.org/wooorm/rehype-highlight

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/rehype-highlight.svg

[codecov]: https://codecov.io/github/wooorm/rehype-highlight

[npm-install]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[rehype]: https://github.com/wooorm/rehype

[lowlight]: https://github.com/wooorm/lowlight

[highlight-js]: https://github.com/isagalaev/highlight.js
