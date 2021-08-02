# rehype-highlight

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**rehype**][rehype] plugin to highlight the syntax of code with
[**lowlight**][lowlight] ([`highlight.js`][highlight-js]).

`rehype-highlight` is built to work with all syntaxes supported by
[`highlight.js`][highlight-js].
It starts off with 35 [common languages][common] registered.
You can add up to 191 languages.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 12+ is needed to use it and it must be `import`ed instead of `require`d.

[npm][]:

```sh
npm install rehype-highlight
```

## Use

Say `example.html` looks as follows:

```html
<h1>Hello World!</h1>

<pre><code class="language-js">var name = "World";
console.warn("Hello, " + name + "!")</code></pre>
```

…and `example.js` like this:

```js
import {readSync} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {rehype} from 'rehype'
import rehypeHighlight from 'rehype-highlight'

const file = readSync('example.html')

rehype()
  .data('settings', {fragment: true})
  .use(rehypeHighlight)
  .process(file)
  .then((file) => {
    console.error(reporter(file))
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

This package exports no identifiers.
The default export is `rehypeHighlight`.

### `unified().use(rehypeHighlight[, options])`

Syntax highlight `pre > code`.
Uses [**lowlight**][lowlight] under the hood, which is a virtual version of
[`highlight.js`][highlight-js].

Configure the language by using a `lang-js` or `language-js` class.
Ignore `code` with a `no-highlight` or `nohighlight` class.
Will auto-detect the syntax language otherwise.

`rehype-highlight` is built to work with all syntaxes supported by
`highlight.js`.
It starts off with 35 [common languages][common] registered.
You can add up to 191 languages.

##### `options`

###### `options.prefix`

Prefix to use before classes (`string`, default: `'hljs-'`).

###### `options.subset`

Scope of languages to check when auto-detecting (`boolean` or `Array.<string>`,
default: all languages).
Pass `false` to not highlight code without language classes.

###### `options.ignoreMissing`

Swallow errors for missing languages (`boolean`, default: `false`).
By default, unregistered syntaxes throw an error when they are used.
Pass `true` to swallow those errors and thus ignore code with unknown code
languages.

###### `options.plainText`

List of plain-text languages (`Array.<string>`, default: `[]`).
Pass any languages you would like to be kept as plain-text instead of getting
highlighted.

###### `options.aliases`

Register more aliases (`Object<string | Array.<string>>`, default: `{}`).
Passed to [`lowlight.registerAlias`][register-alias].

###### `options.languages`

Register more languages (`Record<string, Function>`, default: `{}`).
Each key/value pair passed as arguments to
[`lowlight.registerLanguage`][register-language].

`rehype-highlight` is built to work with all syntaxes supported by
`highlight.js`.
It starts off with 35 [common languages][common] registered.
You can add up to 191 languages.

## Security

Use of `rehype-highlight` *should* be safe to use as `lowlight` *should* be safe
to use.
When in doubt, use [`rehype-sanitize`][sanitize].

## Contribute

See [`contributing.md`][contributing] in [`rehypejs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/rehypejs/rehype-highlight/workflows/main/badge.svg

[build]: https://github.com/rehypejs/rehype-highlight/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/rehypejs/rehype-highlight.svg

[coverage]: https://codecov.io/github/rehypejs/rehype-highlight

[downloads-badge]: https://img.shields.io/npm/dm/rehype-highlight.svg

[downloads]: https://www.npmjs.com/package/rehype-highlight

[size-badge]: https://img.shields.io/bundlephobia/minzip/rehype-highlight.svg

[size]: https://bundlephobia.com/result?p=rehype-highlight

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/rehypejs/rehype/discussions

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/rehypejs/.github

[contributing]: https://github.com/rehypejs/.github/blob/HEAD/contributing.md

[support]: https://github.com/rehypejs/.github/blob/HEAD/support.md

[coc]: https://github.com/rehypejs/.github/blob/HEAD/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[rehype]: https://github.com/rehypejs/rehype

[lowlight]: https://github.com/wooorm/lowlight

[register-alias]: https://github.com/wooorm/lowlight#lowregisteraliasname-alias

[register-language]: https://github.com/wooorm/lowlight#lowregisterlanguagename-syntax

[highlight-js]: https://github.com/isagalaev/highlight.js

[sanitize]: https://github.com/rehypejs/rehype-sanitize

[common]: https://github.com/wooorm/lowlight#syntaxes
