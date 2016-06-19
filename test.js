/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module rehype-highlight
 * @fileoverview Test suite for `rehype-highlight`.
 */

'use strict';

/* eslint-env node */
/* jscs:disable jsDoc */
/* jscs:disable maximumLineLength */

/* Dependencies. */
var test = require('tape');
var rehype = require('rehype');
var highlight = require('./index.js');

/* Tests. */
test('highlight()', function (t) {
    t.equal(
        rehype().use(highlight).process([
            '<h1>Hello World!</h1>',
            '',
            '<pre><code></code></pre>'
        ].join('\n')).toString(),
        [
            '<h1>Hello World!</h1>',
            '',
            '<pre><code class="hljs"></code></pre>'
        ].join('\n'),
        'empty'
    );

    t.equal(
        rehype().use(highlight).process([
            '<h1>Hello World!</h1>',
            '',
            '<pre><code>"use strict";</code></pre>'
        ].join('\n')).toString(),
        [
            '<h1>Hello World!</h1>',
            '',
            '<pre><code class="hljs language-javascript"><span class="hljs-meta">&#x22;use strict&#x22;</span>;</code></pre>'
        ].join('\n'),
        'should highlight (no class)'
    );

    t.equal(
        rehype().use(highlight, {
            subset: ['applescript']
        }).process([
            '<h1>Hello World!</h1>',
            '',
            '<pre><code>"use strict";</code></pre>'
        ].join('\n')).toString(),
        [
            '<h1>Hello World!</h1>',
            '',
            '<pre><code class="hljs language-applescript"><span class="hljs-string">&#x22;use strict&#x22;</span>;</code></pre>'
        ].join('\n'),
        'should highlight (no class, subset)'
    );

    t.equal(
        rehype().use(highlight, {
            subset: false
        }).process([
            '<h1>Hello World!</h1>',
            '',
            '<pre><code>"use strict";</code></pre>'
        ].join('\n')).toString(),
        [
            '<h1>Hello World!</h1>',
            '',
            '<pre><code>&#x22;use strict&#x22;;</code></pre>'
        ].join('\n'),
        'should not highlight (no class, subset: false)'
    );

    t.equal(
        rehype().use(highlight, {
            prefix: 'foo'
        }).process([
            '<h1>Hello World!</h1>',
            '',
            '<pre><code>"use strict";</code></pre>'
        ].join('\n')).toString(),
        [
            '<h1>Hello World!</h1>',
            '',
            '<pre><code class="foo language-javascript"><span class="foometa">&#x22;use strict&#x22;</span>;</code></pre>'
        ].join('\n'),
        'should highlight (prefix without dash)'
    );

    t.equal(
        rehype().use(highlight, {
            prefix: 'foo-'
        }).process([
            '<h1>Hello World!</h1>',
            '',
            '<pre><code>"use strict";</code></pre>'
        ].join('\n')).toString(),
        [
            '<h1>Hello World!</h1>',
            '',
            '<pre><code class="foo language-javascript"><span class="foo-meta">&#x22;use strict&#x22;</span>;</code></pre>'
        ].join('\n'),
        'should highlight (prefix with dash)'
    );

    t.equal(
        rehype().use(highlight).process([
            '<h1>Hello World!</h1>',
            '',
            '<pre><code class="lang-js">var name = "World";',
            'console.log("Hello, " + name + "!")</code></pre>'
        ].join('\n')).toString(),
        [
            '<h1>Hello World!</h1>',
            '',
            '<pre><code class="hljs lang-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">&#x22;World&#x22;</span>;',
            '<span class="hljs-built_in">console</span>.log(<span class="hljs-string">&#x22;Hello, &#x22;</span> + name + <span class="hljs-string">&#x22;!&#x22;</span>)</code></pre>'
        ].join('\n'),
        'should highlight (lang class)'
    );

    t.equal(
        rehype().use(highlight).process([
            '<h1>Hello World!</h1>',
            '',
            '<pre><code class="language-js">var name = "World";',
            'console.log("Hello, " + name + "!")</code></pre>'
        ].join('\n')).toString(),
        [
            '<h1>Hello World!</h1>',
            '',
            '<pre><code class="hljs language-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">&#x22;World&#x22;</span>;',
            '<span class="hljs-built_in">console</span>.log(<span class="hljs-string">&#x22;Hello, &#x22;</span> + name + <span class="hljs-string">&#x22;!&#x22;</span>)</code></pre>'
        ].join('\n'),
        'should highlight (language class)'
    );

    t.equal(
        rehype().use(highlight).process([
            '<h1>Hello World!</h1>',
            '',
            '<pre><code class="language-javascript">var name = "World";',
            'console.log("Hello, " + name + "!")</code></pre>'
        ].join('\n')).toString(),
        [
            '<h1>Hello World!</h1>',
            '',
            '<pre><code class="hljs language-javascript"><span class="hljs-keyword">var</span> name = <span class="hljs-string">&#x22;World&#x22;</span>;',
            '<span class="hljs-built_in">console</span>.log(<span class="hljs-string">&#x22;Hello, &#x22;</span> + name + <span class="hljs-string">&#x22;!&#x22;</span>)</code></pre>'
        ].join('\n'),
        'should highlight (long name)'
    );

    t.equal(
        rehype().use(highlight).process([
            '<h1>Hello World!</h1>',
            '',
            '<pre><code class="no-highlight">var name = "World";',
            'console.log("Hello, " + name + "!")</code></pre>'
        ].join('\n')).toString(),
        [
            '<h1>Hello World!</h1>',
            '',
            '<pre><code class="no-highlight">var name = &#x22;World&#x22;;',
            'console.log(&#x22;Hello, &#x22; + name + &#x22;!&#x22;)</code></pre>'
        ].join('\n'),
        'should not highlight (`no-highlight`)'
    );

    t.equal(
        rehype().use(highlight).process([
            '<h1>Hello World!</h1>',
            '',
            '<pre><code class="nohighlight">var name = "World";',
            'console.log("Hello, " + name + "!")</code></pre>'
        ].join('\n')).toString(),
        [
            '<h1>Hello World!</h1>',
            '',
            '<pre><code class="nohighlight">var name = &#x22;World&#x22;;',
            'console.log(&#x22;Hello, &#x22; + name + &#x22;!&#x22;)</code></pre>'
        ].join('\n'),
        'should not highlight (`nohighlight`)'
    );

    t.equal(
        rehype().use(highlight).process([
            '<h1>Hello World!</h1>',
            '',
            '<pre><code class="hljs lang-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">&#x22;World&#x22;</span>;',
            '<span class="hljs-built_in">console</span>.log(<span class="hljs-string">&#x22;Hello, &#x22;</span> + name + <span class="hljs-string">&#x22;!&#x22;</span>)</code></pre>'
        ].join('\n')).toString(),
        [
            '<h1>Hello World!</h1>',
            '',
            '<pre><code class="hljs lang-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">&#x22;World&#x22;</span>;',
            '<span class="hljs-built_in">console</span>.log(<span class="hljs-string">&#x22;Hello, &#x22;</span> + name + <span class="hljs-string">&#x22;!&#x22;</span>)</code></pre>'
        ].join('\n'),
        'should reprocess exact'
    );

    t.equal(
        rehype().use(highlight).process([
            '<h1>Hello World!</h1>',
            '',
            '<pre><code><!--TODO-->"use strict";</code></pre>'
        ].join('\n')).toString(),
        [
            '<h1>Hello World!</h1>',
            '',
            '<pre><code class="hljs language-javascript"><span class="hljs-meta">&#x22;use strict&#x22;</span>;</code></pre>'
        ].join('\n'),
        'should ignore comments'
    );

    t.end();
});
