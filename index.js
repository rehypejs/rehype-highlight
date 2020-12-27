'use strict'

var visit = require('unist-util-visit')
var lowlight = require('lowlight')
var toText = require('hast-util-to-text')

module.exports = attacher

function attacher(options) {
  var settings = options || {}
  var detect = settings.subset !== false
  var prefix = settings.prefix
  var ignoreMissing = settings.ignoreMissing
  var plainText = settings.plainText || []
  var aliases = settings.aliases
  var languages = settings.languages
  var name = 'hljs'
  var pos

  if (aliases) {
    lowlight.registerAlias(aliases)
  }

  if (languages) {
    // eslint-disable-next-line guard-for-in
    for (let name in languages) {
      lowlight.registerLanguage(name, languages[name])
    }
  }

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
      result = lang
        ? lowlight.highlight(lang, toText(parent), options)
        : lowlight.highlightAuto(toText(parent), options)
    } catch (error) {
      if (error && ignoreMissing && /Unknown language/.test(error.message)) {
        return
      }

      throw error
    }

    if (!lang && result.language) {
      props.className.push('language-' + result.language)
    }

    node.children = result.value
  }
}

// Get the programming language of `node`.
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
