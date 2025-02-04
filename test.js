import assert from 'node:assert/strict'
import test from 'node:test'
import rehypeHighlight from 'rehype-highlight'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import {unified} from 'unified'

test('rehypeHighlight', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('rehype-highlight')).sort(), [
      'default'
    ])
  })

  await t.test('should work on empty code', async function () {
    const file = await unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeHighlight, {detect: true})
      .use(rehypeStringify)
      .process(
        ['<h1>Hello World!</h1>', '', '<pre><code></code></pre>'].join('\n')
      )

    assert.equal(
      String(file),
      [
        '<h1>Hello World!</h1>',
        '',
        '<pre><code class="hljs"></code></pre>'
      ].join('\n')
    )
  })

  await t.test('should not highlight (no class)', async function () {
    const file = await unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code>"use strict";</code></pre>'
        ].join('\n')
      )

    assert.equal(
      String(file),
      [
        '<h1>Hello World!</h1>',
        '',
        '<pre><code>"use strict";</code></pre>'
      ].join('\n')
    )
  })

  await t.test('should highlight (`detect`, no class)', async function () {
    const file = await unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeHighlight, {detect: true})
      .use(rehypeStringify)
      .process(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code>"use strict";</code></pre>'
        ].join('\n')
      )

    assert.equal(
      String(file),
      [
        '<h1>Hello World!</h1>',
        '',
        '<pre><code class="hljs language-javascript"><span class="hljs-meta">"use strict"</span>;</code></pre>'
      ].join('\n')
    )
  })

  await t.test(
    'should highlight (detect, no class, subset)',
    async function () {
      const file = await unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeHighlight, {detect: true, subset: ['arduino']})
        .use(rehypeStringify)
        .process(
          [
            '<h1>Hello World!</h1>',
            '',
            '<pre><code>"use strict";</code></pre>'
          ].join('\n')
        )

      assert.equal(
        String(file),
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code class="hljs language-arduino"><span class="hljs-string">"use strict"</span>;</code></pre>'
        ].join('\n')
      )
    }
  )

  await t.test(
    'should not highlight (`detect: false`, no class)',
    async function () {
      const file = await unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeHighlight, {detect: false})
        .use(rehypeStringify)
        .process(
          [
            '<h1>Hello World!</h1>',
            '',
            '<pre><code>"use strict";</code></pre>'
          ].join('\n')
        )

      assert.equal(
        String(file),
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code>"use strict";</code></pre>'
        ].join('\n')
      )
    }
  )

  await t.test('should highlight (prefix without dash)', async function () {
    const file = await unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeHighlight, {detect: true, prefix: 'foo'})
      .use(rehypeStringify)
      .process(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code>"use strict";</code></pre>'
        ].join('\n')
      )

    assert.equal(
      String(file),
      [
        '<h1>Hello World!</h1>',
        '',
        '<pre><code class="foo language-javascript"><span class="foometa">"use strict"</span>;</code></pre>'
      ].join('\n')
    )
  })

  await t.test('should highlight (prefix with dash)', async function () {
    const file = await unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeHighlight, {detect: true, prefix: 'foo-'})
      .use(rehypeStringify)
      .process(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code>"use strict";</code></pre>'
        ].join('\n')
      )

    assert.equal(
      String(file),
      [
        '<h1>Hello World!</h1>',
        '',
        '<pre><code class="foo language-javascript"><span class="foo-meta">"use strict"</span>;</code></pre>'
      ].join('\n')
    )
  })

  await t.test('should highlight (lang class)', async function () {
    const file = await unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code class="lang-js">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>'
        ].join('\n')
      )

    assert.equal(
      String(file),
      [
        '<h1>Hello World!</h1>',
        '',
        '<pre><code class="hljs lang-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
        '<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>'
      ].join('\n')
    )
  })

  await t.test('should highlight (language class)', async function () {
    const file = await unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code class="language-js">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>'
        ].join('\n')
      )

    assert.equal(
      String(file),
      [
        '<h1>Hello World!</h1>',
        '',
        '<pre><code class="hljs language-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
        '<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>'
      ].join('\n')
    )
  })

  await t.test('should highlight (long name)', async function () {
    const file = await unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code class="language-javascript">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>'
        ].join('\n')
      )

    assert.equal(
      String(file),
      [
        '<h1>Hello World!</h1>',
        '',
        '<pre><code class="hljs language-javascript"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
        '<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>'
      ].join('\n')
    )
  })

  await t.test('should not highlight (`no-highlight`)', async function () {
    const file = await unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code class="no-highlight">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>'
        ].join('\n')
      )

    assert.equal(
      String(file),
      [
        '<h1>Hello World!</h1>',
        '',
        '<pre><code class="no-highlight">var name = "World";',
        'console.log("Hello, " + name + "!")</code></pre>'
      ].join('\n')
    )
  })

  await t.test(
    'should prefer `no-highlight` over a `language-*` class',
    async function () {
      const file = await unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeHighlight)
        .use(rehypeStringify)
        .process(
          '<h1>Hello World!</h1>\n<pre><code class="lang-js no-highlight">alert(1)</code></pre>'
        )

      assert.equal(
        String(file),
        '<h1>Hello World!</h1>\n<pre><code class="lang-js no-highlight">alert(1)</code></pre>'
      )
    }
  )

  await t.test('should not highlight (`nohighlight`)', async function () {
    const file = await unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code class="nohighlight">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>'
        ].join('\n')
      )

    assert.equal(
      String(file),
      [
        '<h1>Hello World!</h1>',
        '',
        '<pre><code class="nohighlight">var name = "World";',
        'console.log("Hello, " + name + "!")</code></pre>'
      ].join('\n')
    )
  })

  await t.test('should warn on missing languages', async function () {
    const file = await unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code class="lang-foobar">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>'
        ].join('\n')
      )

    assert.deepEqual(file.messages.map(String), [
      '3:6-4:43: Cannot highlight as `foobar`, it’s not registered'
    ])
  })

  await t.test(
    'should not highlight plainText-ed languages',
    async function () {
      const file = await unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeHighlight, {plainText: ['js']})
        .use(rehypeStringify)
        .process(
          [
            '<h1>Hello World!</h1>',
            '',
            '<pre><code class="lang-js">var name = "World";',
            'console.log("Hello, " + name + "!")</code></pre>'
          ].join('\n')
        )

      assert.equal(
        String(file),
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code class="lang-js">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>'
        ].join('\n')
      )
    }
  )

  await t.test('should not remove contents', async function () {
    // For some reason this isn’t detected as c++.
    const file = await unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeHighlight, {detect: true, subset: ['cpp']})
      .use(rehypeStringify)
      .process(`<pre><code>def add(a, b):\n  return a + b</code></pre>`)

    assert.equal(
      String(file),
      '<pre><code class="hljs">def add(a, b):\n  return a + b</code></pre>'
    )
  })

  await t.test('should support multiple `code`s in a `pre`', async function () {
    const file = await unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeHighlight)
      .use(rehypeStringify).process(`<pre>
  <code class="language-javascript">const a = 1;</code>
  <code class="language-python">printf("x")</code>
</pre>`)

    assert.equal(
      String(file),
      '<pre>  <code class="hljs language-javascript"><span class="hljs-keyword">const</span> a = <span class="hljs-number">1</span>;</code>\n  <code class="hljs language-python">printf(<span class="hljs-string">"x"</span>)</code>\n</pre>'
    )
  })

  await t.test('should parse custom language', async function () {
    const file = await unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeHighlight, {aliases: {javascript: ['funkyscript']}})
      .use(rehypeStringify)
      .process(
        '<pre><code class="lang-funkyscript">console.log(1)</code></pre>'
      )

    assert.equal(
      String(file),
      '<pre><code class="hljs lang-funkyscript"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-number">1</span>)</code></pre>'
    )
  })

  await t.test('should reprocess exact', async function () {
    const expected = [
      '<h1>Hello World!</h1>',
      '',
      '<pre><code class="hljs lang-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
      '<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>'
    ].join('\n')

    const file = await unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(expected)

    assert.equal(String(file), expected)
  })

  await t.test('should ignore comments', async function () {
    const file = await unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeHighlight, {detect: true})
      .use(rehypeStringify)
      .process(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code><!--TODO-->"use strict";</code></pre>'
        ].join('\n')
      )

    assert.equal(
      String(file),
      [
        '<h1>Hello World!</h1>',
        '',
        '<pre><code class="hljs language-javascript"><span class="hljs-meta">"use strict"</span>;</code></pre>'
      ].join('\n')
    )
  })

  await t.test('should support `<br>` elements', async function () {
    const file = await unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code class="language-javascript">"use strict";<br>console.log("very strict")</code></pre>'
        ].join('\n')
      )

    assert.equal(
      String(file),
      [
        '<h1>Hello World!</h1>',
        '',
        '<pre><code class="hljs language-javascript"><span class="hljs-meta">"use strict"</span>;',
        '<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"very strict"</span>)</code></pre>'
      ].join('\n')
    )
  })

  await t.test('should register languages', async function () {
    const file = await unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeHighlight, {
        languages: {
          test() {
            return {
              aliases: [],
              contains: [],
              keywords: {keyword: 'bravo'}
            }
          }
        }
      })
      .use(rehypeStringify)
      .process(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code class="language-test">alpha bravo charlie</code></pre>'
        ].join('\n')
      )

    assert.equal(
      String(file),
      [
        '<h1>Hello World!</h1>',
        '',
        '<pre><code class="hljs language-test">alpha <span class="hljs-keyword">bravo</span> charlie</code></pre>'
      ].join('\n')
    )
  })
})
