'use strict'

var test = require('tape')
var rehype = require('rehype')
var highlight = require('.')
var light = require('./light')
var js = require('highlight.js/lib/languages/javascript')
var as = require('highlight.js/lib/languages/applescript')
var cp = require('highlight.js/lib/languages/cpp')

test('options.languages', function (t) {
  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(highlight, {
        languages: {
          js: js
        }
      })
      .processSync(
        ['<pre><code class="js">const two = 2;</code></pre>'].join('\n')
      )
      .toString(),
    [
      '<pre><code class="hljs js javascript">',
      '<const>two = <span class="hljs-number">2</span>;</const>',
      '</code></pre>'
    ].join(
      '\n'
    ),
    'empty'
  )

  t.end()
})

test('highlight()', function (t) {
  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(highlight)
      .processSync(
        ['<h1>Hello World!</h1>', '', '<pre><code></code></pre>'].join('\n')
      )
      .toString(),
    ['<h1>Hello World!</h1>', '', '<pre><code class="hljs"></code></pre>'].join(
      '\n'
    ),
    'empty'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(highlight)
      .processSync(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code>"use strict";</code></pre>'
        ].join('\n')
      )
      .toString(),
    [
      '<h1>Hello World!</h1>',
      '',
      '<pre><code class="hljs language-javascript"><span class="hljs-meta">"use strict"</span>;</code></pre>'
    ].join('\n'),
    'should highlight (no class)'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(highlight, {subset: ['applescript']})
      .processSync(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code>"use strict";</code></pre>'
        ].join('\n')
      )
      .toString(),
    [
      '<h1>Hello World!</h1>',
      '',
      '<pre><code class="hljs language-applescript"><span class="hljs-string">"use strict"</span>;</code></pre>'
    ].join('\n'),
    'should highlight (no class, subset)'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(highlight, {subset: false})
      .processSync(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code>"use strict";</code></pre>'
        ].join('\n')
      )
      .toString(),
    ['<h1>Hello World!</h1>', '', '<pre><code>"use strict";</code></pre>'].join(
      '\n'
    ),
    'should not highlight (no class, subset: false)'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(highlight, {prefix: 'foo'})
      .processSync(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code>"use strict";</code></pre>'
        ].join('\n')
      )
      .toString(),
    [
      '<h1>Hello World!</h1>',
      '',
      '<pre><code class="foo language-javascript"><span class="foometa">"use strict"</span>;</code></pre>'
    ].join('\n'),
    'should highlight (prefix without dash)'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(highlight, {prefix: 'foo-'})
      .processSync(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code>"use strict";</code></pre>'
        ].join('\n')
      )
      .toString(),
    [
      '<h1>Hello World!</h1>',
      '',
      '<pre><code class="foo language-javascript"><span class="foo-meta">"use strict"</span>;</code></pre>'
    ].join('\n'),
    'should highlight (prefix with dash)'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(highlight)
      .processSync(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code class="lang-js">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>'
        ].join('\n')
      )
      .toString(),
    [
      '<h1>Hello World!</h1>',
      '',
      '<pre><code class="hljs lang-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
      '<span class="hljs-built_in">console</span>.log(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>'
    ].join('\n'),
    'should highlight (lang class)'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(highlight)
      .processSync(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code class="language-js">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>'
        ].join('\n')
      )
      .toString(),
    [
      '<h1>Hello World!</h1>',
      '',
      '<pre><code class="hljs language-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
      '<span class="hljs-built_in">console</span>.log(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>'
    ].join('\n'),
    'should highlight (language class)'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(highlight)
      .processSync(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code class="language-javascript">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>'
        ].join('\n')
      )
      .toString(),
    [
      '<h1>Hello World!</h1>',
      '',
      '<pre><code class="hljs language-javascript"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
      '<span class="hljs-built_in">console</span>.log(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>'
    ].join('\n'),
    'should highlight (long name)'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(highlight)
      .processSync(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code class="no-highlight">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>'
        ].join('\n')
      )
      .toString(),
    [
      '<h1>Hello World!</h1>',
      '',
      '<pre><code class="no-highlight">var name = "World";',
      'console.log("Hello, " + name + "!")</code></pre>'
    ].join('\n'),
    'should not highlight (`no-highlight`)'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(highlight)
      .processSync(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code class="nohighlight">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>'
        ].join('\n')
      )
      .toString(),
    [
      '<h1>Hello World!</h1>',
      '',
      '<pre><code class="nohighlight">var name = "World";',
      'console.log("Hello, " + name + "!")</code></pre>'
    ].join('\n'),
    'should not highlight (`nohighlight`)'
  )

  t.throws(
    function () {
      rehype()
        .data('settings', {fragment: true})
        .use(highlight)
        .processSync(
          [
            '<h1>Hello World!</h1>',
            '',
            '<pre><code class="lang-foobar">var name = "World";',
            'console.log("Hello, " + name + "!")</code></pre>'
          ].join('\n')
        )
        .toString()
    },
    'Unknown language: `foobar` is not registered',
    'should throw on missing languages'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(highlight, {ignoreMissing: true})
      .processSync(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code class="lang-foobar">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>'
        ].join('\n')
      )
      .toString(),
    [
      '<h1>Hello World!</h1>',
      '',
      '<pre><code class="hljs lang-foobar">var name = "World";',
      'console.log("Hello, " + name + "!")</code></pre>'
    ].join('\n'),
    'should ignore missing languages'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(highlight, {plainText: ['js']})
      .processSync(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code class="lang-js">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>'
        ].join('\n')
      )
      .toString(),
    [
      '<h1>Hello World!</h1>',
      '',
      '<pre><code class="lang-js">var name = "World";',
      'console.log("Hello, " + name + "!")</code></pre>'
    ].join('\n'),
    'should not highlight plainText-ed languages'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(highlight, {subset: ['cpp']})
      .processSync(`<pre><code>def add(a, b):\n  return a + b</code></pre>`)
      .toString(),
    '<pre><code class="hljs language-cpp"><span class="hljs-function">def <span class="hljs-title">add</span><span class="hljs-params">(a, b)</span>:\n  <span class="hljs-keyword">return</span> a + b</span></code></pre>',
    'should not remove contents'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(highlight)
      .processSync(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code class="hljs lang-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
          '<span class="hljs-built_in">console</span>.log(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>'
        ].join('\n')
      )
      .toString(),
    [
      '<h1>Hello World!</h1>',
      '',
      '<pre><code class="hljs lang-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
      '<span class="hljs-built_in">console</span>.log(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>'
    ].join('\n'),
    'should reprocess exact'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(highlight, {
        aliases: {tex: ['latex']}
      })
      .processSync(
        [
          '<pre><code class="lang-latex">\\begin{document}',
          '\\end{document}</code></pre>'
        ].join('\n')
      )
      .toString(),
    [
      '<pre><code class="hljs lang-latex"><span class="hljs-keyword">\\begin</span>{document}',
      '<span class="hljs-keyword">\\end</span>{document}</code></pre>'
    ].join('\n'),
    'should parse custom language'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(highlight)
      .processSync(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code class="hljs lang-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
          '<span class="hljs-built_in">console</span>.log(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>'
        ].join('\n')
      )
      .toString(),
    [
      '<h1>Hello World!</h1>',
      '',
      '<pre><code class="hljs lang-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
      '<span class="hljs-built_in">console</span>.log(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>'
    ].join('\n'),
    'should reprocess exact'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(highlight)
      .processSync(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code><!--TODO-->"use strict";</code></pre>'
        ].join('\n')
      )
      .toString(),
    [
      '<h1>Hello World!</h1>',
      '',
      '<pre><code class="hljs language-javascript"><span class="hljs-meta">"use strict"</span>;</code></pre>'
    ].join('\n'),
    'should ignore comments'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(highlight)
      .processSync(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code>"use strict";<br>console.log("very strict")</code></pre>'
        ].join('\n')
      )
      .toString(),
    [
      '<h1>Hello World!</h1>',
      '',
      '<pre><code class="hljs language-javascript"><span class="hljs-meta">"use strict"</span>;',
      '<span class="hljs-built_in">console</span>.log(<span class="hljs-string">"very strict"</span>)</code></pre>'
    ].join('\n'),
    'should support `<br>` elements'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(highlight, {
        languages: {
          test: function () {
            return {
              aliases: ['test'],
              keywords: {keyword: 'test'}
            }
          }
        }
      })
      .processSync(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code>test normal text</code></pre>'
        ].join('\n')
      )
      .toString(),
    [
      '<h1>Hello World!</h1>',
      '',
      '<pre><code class="hljs language-subunit"><span class="hljs-keyword">test </span>normal text</code></pre>'
    ].join('\n'),
    'should register languages'
  )

  t.end()
})

// Light section

test('highlight/light()', function (t) {
  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(light)
      .processSync(
        ['<h1>Hello World!</h1>', '', '<pre><code></code></pre>'].join('\n')
      )
      .toString(),
    ['<h1>Hello World!</h1>', '', '<pre><code class="hljs"></code></pre>'].join(
      '\n'
    ),
    'empty'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(light, {languages: {javascript: js}})
      .processSync(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code>"use strict";</code></pre>'
        ].join('\n')
      )
      .toString(),
    [
      '<h1>Hello World!</h1>',
      '',
      '<pre><code class="hljs language-javascript"><span class="hljs-meta">"use strict"</span>;</code></pre>'
    ].join('\n'),
    'should highlight (no class)'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(light, {subset: ['applescript'], languages: {applescript: as}})
      .processSync(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code>"use strict";</code></pre>'
        ].join('\n')
      )
      .toString(),
    [
      '<h1>Hello World!</h1>',
      '',
      '<pre><code class="hljs language-applescript"><span class="hljs-string">"use strict"</span>;</code></pre>'
    ].join('\n'),
    'should highlight (no class, subset)'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(light, {subset: false, languages: {javascript: js}})
      .processSync(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code>"use strict";</code></pre>'
        ].join('\n')
      )
      .toString(),
    ['<h1>Hello World!</h1>', '', '<pre><code>"use strict";</code></pre>'].join(
      '\n'
    ),
    'should not highlight (no class, subset: false)'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(light, {prefix: 'foo', languages: {javascript: js}})
      .processSync(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code>"use strict";</code></pre>'
        ].join('\n')
      )
      .toString(),
    [
      '<h1>Hello World!</h1>',
      '',
      '<pre><code class="foo language-javascript"><span class="foometa">"use strict"</span>;</code></pre>'
    ].join('\n'),
    'should highlight (prefix without dash)'
  )

  t.equal(
    rehype()
      .data('settings', {fragment: true})
      .use(light, {subset: ['cpp'], languages: {cpp: cp}})
      .processSync(`<pre><code>def add(a, b):\n  return a + b</code></pre>`)
      .toString(),
    '<pre><code class="hljs language-cpp"><span class="hljs-function">def <span class="hljs-title">add</span><span class="hljs-params">(a, b)</span>:\n  <span class="hljs-keyword">return</span> a + b</span></code></pre>',
    'should not remove contents'
  )

  t.end()
})
