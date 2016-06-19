/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module rehype:highlight
 * @fileoverview Highlight code blocks.
 */

'use strict';

/* eslint-env commonjs */

/* Dependencies */
var visit = require('unist-util-visit');
var lowlight = require('lowlight');

/**
 * Get the programming language of `node`.
 *
 * @param {Element} node - Node to check.
 * @return {boolean|string?} - Programming language of
 *   `node`.  `false` if the node shouldn’t be highlighted.
 */
function language(node) {
    var className = node.properties.className || [];
    var length = className.length;
    var index = -1;
    var value;

    while (++index < length) {
        value = className[index];

        if (value === 'no-highlight' || value === 'nohighlight') {
            return false;
        }

        if (value.slice(0, 5) === 'lang-') {
            return value.slice(5);
        }

        if (value.slice(0, 9) === 'language-') {
            return value.slice(9);
        }
    }

    return null;
}

/**
 * Get the text content of `node`.
 *
 * @param {Node} node - Node to stringify.
 * @return {string} - Content.
 */
function text(node) {
    var children = node.children;
    var length = children.length;
    var result = [];
    var index = -1;
    var child;
    var value;

    while (++index < length) {
        child = children[index];
        value = ''

        if (child.children) {
            value = text(child);
        } else if (child.type === 'text') {
            value = child.value;
        }

        result[index] = value;
    }

    return result.join('');
}

/**
 * Attacher.
 *
 * @param {Unified} origin - Origin processor.
 * @param {Object} [options={}] - Configuration.
 * @return {Function} - Transformer.
 */
function attacher(origin, options) {
    var settings = options || {};
    var detect = settings.subset !== false;
    var prefix = settings.prefix;
    var name = 'hljs';
    var pos;

    if (prefix) {
        pos = prefix.indexOf('-');
        name = pos === -1 ? prefix : prefix.slice(0, pos);
    }

    return function (tree) {
        visit(tree, 'element', function (node, index, parent) {
            var props = node.properties;
            var result;
            var lang;

            if (
                !parent ||
                parent.tagName !== 'pre' ||
                node.tagName !== 'code'
            ) {
                return;
            }

            lang = language(node);

            if (lang === false || (!lang && !detect)) {
                return;
            }

            if (!props.className) {
                props.className = [];
            }

            if (props.className.indexOf(name) === -1) {
                props.className.unshift(name);
            }

            if (lang) {
                result = lowlight.highlight(lang, text(node), options);
            } else {
                result = lowlight.highlightAuto(text(node), options);

                if (result.language) {
                    props.className.push('language-' + result.language);
                }
            }

            node.children = result.value;
        });
    };
}

/* Expose. */
module.exports = attacher;
