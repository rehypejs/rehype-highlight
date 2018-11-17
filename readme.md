# rehype-highlight

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Chat][chat-badge]][chat]

Syntax highlighting for [**rehype**][rehype].

## Installation

[npm][]:

```bash
npm install rehype-highlight
```

## Usage

Say `example.html` looks as follows:

```html
<h1>Hello World!</h1>

<pre><code class="language-js">var name = "World";
console.warn("Hello, " + name + "!")</code></pre>
```

...and `example.js` like this:

```javascript
var vfile = require('to-vfile')
var report = require('vfile-reporter')
var rehype = require('rehype')
var highlight = require('rehype-highlight')

rehype()
  .data('settings', {fragment: true})
  .use(highlight)
  .process(vfile.readSync('example.html'), function(err, file) {
    console.error(report(err || file))
    console.log(String(file))
  })
```

Now, running `node example` yields:

```html
example.html: no issues found
<h1>Hello World!</h1>

<pre><code class="hljs language-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;
<span class="hljs-built_in">console</span>.warn(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>
```

## API

### `rehype().use(highlight[, options])`

Syntax highlight `pre > code`.  Uses [**lowlight**][lowlight] under
the hood, which is a virtual version of [`highlight.js`][highlight-js].

Configure the language by using a `lang-js` or `language-js` class.
Ignore `code` with a `no-highlight` or `nohighlight` class.
Will auto-detect the syntax language otherwise.

##### `options`

###### `options.prefix`

`string`, default: `'hljs-'` — Prefix to use before classes.

###### `options.subset`

`boolean` or `Array.<string>`, default: all languages — Scope of languages to
check when auto-detecting.  Pass `false` to not highlight code without
language classes.

###### `options.ignoreMissing`

`boolean`, default: `false`.  By default, unregistered syntaxes throw an error
when they are used.  Pass `true` to swallow those errors and thus ignore code
with unknown code languages.

###### `options.plainText`

`Array.<string>`, default: `[]`.  Pass any languages you would like to be kept
as plain-text instead of getting highlighted.

###### `options.aliases`

`Object<string | Array.<string>>`, default: `{}`.
Register more aliases.
Passed to [`lowlight.registerAlias`][register-alias].

## Contribute

See [`contributing.md` in `rehypejs/rehype`][contribute] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/rehypejs/rehype-highlight.svg

[build]: https://travis-ci.org/rehypejs/rehype-highlight

[coverage-badge]: https://img.shields.io/codecov/c/github/rehypejs/rehype-highlight.svg

[coverage]: https://codecov.io/github/rehypejs/rehype-highlight

[downloads-badge]: https://img.shields.io/npm/dm/rehype-highlight.svg

[downloads]: https://www.npmjs.com/package/rehype-highlight

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/rehype

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[rehype]: https://github.com/rehypejs/rehype

[lowlight]: https://github.com/wooorm/lowlight

[register-alias]: https://github.com/wooorm/lowlight#lowregisteraliasname-alias

[highlight-js]: https://github.com/isagalaev/highlight.js

[contribute]: https://github.com/rehypejs/rehype/blob/master/contributing.md

[coc]: https://github.com/rehypejs/rehype/blob/master/code-of-conduct.md
