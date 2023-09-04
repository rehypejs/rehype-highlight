/**
 * @typedef {import('lowlight/lib/core.js').HighlightSyntax} HighlightSyntax
 *   To do: expose from lowlight root?
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {rehype} from 'rehype'
import rehypeHighlight from './index.js'

test('rehypeHighlight', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('./index.js')).sort(), [
      'default'
    ])
  })

  await t.test('should work on empty code', async function () {
    const file = await rehype()
      .data('settings', {fragment: true})
      .use(rehypeHighlight, {detect: true})
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
    const file = await rehype()
      .data('settings', {fragment: true})
      .use(rehypeHighlight)
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
    const file = await rehype()
      .data('settings', {fragment: true})
      .use(rehypeHighlight, {detect: true})
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
      const file = await rehype()
        .data('settings', {fragment: true})
        .use(rehypeHighlight, {detect: true, subset: ['arduino']})
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
      const file = await rehype()
        .data('settings', {fragment: true})
        .use(rehypeHighlight, {detect: false})
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
    const file = await rehype()
      .data('settings', {fragment: true})
      .use(rehypeHighlight, {detect: true, prefix: 'foo'})
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
    const file = await rehype()
      .data('settings', {fragment: true})
      .use(rehypeHighlight, {detect: true, prefix: 'foo-'})
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
    const file = await rehype()
      .data('settings', {fragment: true})
      .use(rehypeHighlight)
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
    const file = await rehype()
      .data('settings', {fragment: true})
      .use(rehypeHighlight)
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
    const file = await rehype()
      .data('settings', {fragment: true})
      .use(rehypeHighlight)
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
    const file = await rehype()
      .data('settings', {fragment: true})
      .use(rehypeHighlight)
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

  await t.test('should not highlight (`nohighlight`)', async function () {
    const file = await rehype()
      .data('settings', {fragment: true})
      .use(rehypeHighlight)
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

  await t.test('should throw on missing languages', async function () {
    try {
      await rehype()
        .data('settings', {fragment: true})
        .use(rehypeHighlight)
        .process(
          [
            '<h1>Hello World!</h1>',
            '',
            '<pre><code class="lang-foobar">var name = "World";',
            'console.log("Hello, " + name + "!")</code></pre>'
          ].join('\n')
        )
      assert.fail()
    } catch (error) {
      assert.match(
        String(error),
        /Cannot highlight as `foobar`, it’s not registered/
      )
    }
  })

  await t.test('should ignore missing languages', async function () {
    const file = await rehype()
      .data('settings', {fragment: true})
      .use(rehypeHighlight, {ignoreMissing: true})
      .process(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code class="lang-foobar">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>'
        ].join('\n')
      )

    assert.equal(
      String(file),
      [
        '<h1>Hello World!</h1>',
        '',
        '<pre><code class="hljs lang-foobar">var name = "World";',
        'console.log("Hello, " + name + "!")</code></pre>'
      ].join('\n')
    )
  })

  await t.test(
    'should not highlight plainText-ed languages',
    async function () {
      const file = await rehype()
        .data('settings', {fragment: true})
        .use(rehypeHighlight, {plainText: ['js']})
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
    const file = await rehype()
      .data('settings', {fragment: true})
      .use(rehypeHighlight, {detect: true, subset: ['cpp']})
      .process(`<pre><code>def add(a, b):\n  return a + b</code></pre>`)

    assert.equal(
      String(file),
      '<pre><code class="hljs">def add(a, b):\n  return a + b</code></pre>'
    )
  })

  await t.test('should reprocess exact', async function () {
    const file = await rehype()
      .data('settings', {fragment: true})
      .use(rehypeHighlight)
      .process(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code class="hljs lang-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
          '<span class="hljs-built_in">console</span>.log(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>'
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

  await t.test('should parse custom language', async function () {
    const file = await rehype()
      .data('settings', {fragment: true})
      .use(rehypeHighlight, {
        aliases: {javascript: ['funkyscript']}
      })
      .process(
        '<pre><code class="lang-funkyscript">console.log(1)</code></pre>'
      )

    assert.equal(
      String(file),
      '<pre><code class="hljs lang-funkyscript"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-number">1</span>)</code></pre>'
    )
  })

  await t.test('should reprocess exact', async function () {
    const file = await rehype()
      .data('settings', {fragment: true})
      .use(rehypeHighlight)
      .process(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code class="hljs lang-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
          '<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>'
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

  await t.test('should ignore comments', async function () {
    const file = await rehype()
      .data('settings', {fragment: true})
      .use(rehypeHighlight, {detect: true})
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
    const file = await rehype()
      .data('settings', {fragment: true})
      .use(rehypeHighlight)
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
    const file = await rehype()
      .data('settings', {fragment: true})
      .use(rehypeHighlight, {languages: {test: testLang}})
      .process(
        [
          '<h1>Hello World!</h1>',
          '',
          '<pre><code class="language-scss">test normal text</code></pre>'
        ].join('\n')
      )

    assert.equal(
      String(file),
      [
        '<h1>Hello World!</h1>',
        '',
        '<pre><code class="hljs language-scss">test <span class="hljs-attribute">normal</span> text</code></pre>'
      ].join('\n')
    )

    /**
     * @type {HighlightSyntax}
     */
    function testLang() {
      return {
        aliases: ['test'],
        contains: [],
        keywords: {keyword: 'test'}
      }
    }
  })
})
