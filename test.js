'use strict'

var test = require('tape')
var rehype = require('rehype')
var highlight = require('.')

test('highlight()', function(t) {
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
    function() {
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
      '<pre><code class="hljs lang-latex"><span class="hljs-tag">',
      '\\<span class="hljs-name">begin</span><span class="hljs-string">{document}</span>',
      '</span>\n<span class="hljs-tag">\\<span class="hljs-name">end</span>',
      '<span class="hljs-string">{document}</span></span></code></pre>'
    ].join(''),
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

  t.end()
})
