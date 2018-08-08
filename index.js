'use strict'

var visit = require('unist-util-visit')
var lowlight = require('lowlight')
var toString = require('hast-util-to-string')

module.exports = attacher

function attacher(options) {
  var settings = options || {}
  var detect = settings.subset !== false
  var prefix = settings.prefix
  var ignoreMissing = settings.ignoreMissing
  var plainText = settings.plainText || []
  var aliases = settings.aliases || {}
  lowlight.registerAlias(aliases)
  var name = 'hljs'
  var pos

  if (prefix) {
    pos = prefix.indexOf('-')
    name = pos === -1 ? prefix : prefix.slice(0, pos)
  }

  return transformer

  function transformer(tree) {
    visit(tree, 'element', visitor)
  }

  function visitor(node, index, parent) {
    var props = node.properties
    var result
    var lang

    if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
      return
    }

    lang = language(node)

    if (
      lang === false ||
      (!lang && !detect) ||
      plainText.indexOf(lang) !== -1
    ) {
      return
    }

    if (!props.className) {
      props.className = []
    }

    if (props.className.indexOf(name) === -1) {
      props.className.unshift(name)
    }

    try {
      if (lang) {
        result = lowlight.highlight(lang, toString(node), options)
      } else {
        result = lowlight.highlightAuto(toString(node), options)
      }
    } catch (err) {
      if (err && ignoreMissing && /Unknown language/.test(err.message)) {
        return
      }

      throw err
    }

    if (!lang && result.language) {
      props.className.push('language-' + result.language)
    }

    node.children = result.value
  }
}

/* Get the programming language of `node`. */
function language(node) {
  var className = node.properties.className || []
  var length = className.length
  var index = -1
  var value

  while (++index < length) {
    value = className[index]

    if (value === 'no-highlight' || value === 'nohighlight') {
      return false
    }

    if (value.slice(0, 5) === 'lang-') {
      return value.slice(5)
    }

    if (value.slice(0, 9) === 'language-') {
      return value.slice(9)
    }
  }

  return null
}
