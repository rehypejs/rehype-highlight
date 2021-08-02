import {lowlight} from 'lowlight'
import {toText} from 'hast-util-to-text'
import {visit} from 'unist-util-visit'

const own = {}.hasOwnProperty

export default function rehypeHighlight(options = {}) {
  let name = 'hljs'

  if (options.aliases) {
    lowlight.registerAlias(options.aliases)
  }

  if (options.languages) {
    let key

    for (key in options.languages) {
      if (own.call(options.languages, key)) {
        lowlight.registerLanguage(key, options.languages[key])
      }
    }
  }

  if (options.prefix) {
    const pos = options.prefix.indexOf('-')
    name = pos > -1 ? options.prefix.slice(0, pos) : options.prefix
  }

  return transformer

  function transformer(tree) {
    visit(tree, 'element', visitor)
  }

  function visitor(node, _, parent) {
    if (
      !parent ||
      parent.tagName !== 'pre' ||
      node.tagName !== 'code' ||
      !node.properties
    ) {
      return
    }

    const lang = language(node)

    if (
      lang === false ||
      (!lang && options.subset === false) ||
      (options.plainText && options.plainText.includes(lang))
    ) {
      return
    }

    if (!node.properties.className) {
      node.properties.className = []
    }

    if (!node.properties.className.includes(name)) {
      node.properties.className.unshift(name)
    }

    let result

    try {
      result = lang
        ? lowlight.highlight(lang, toText(parent), options)
        : lowlight.highlightAuto(toText(parent), options)
    } catch (error) {
      if (!options.ignoreMissing || !/Unknown language/.test(error.message)) {
        throw error
      }

      result = {type: 'root', data: {}, children: []}
    }

    if (!lang && result.data.language) {
      node.properties.className.push('language-' + result.data.language)
    }

    if (Array.isArray(result.children) && result.children.length > 0) {
      node.children = result.children
    }
  }
}

// Get the programming language of `node`.
function language(node) {
  const className = node.properties.className || []
  let index = -1

  while (++index < className.length) {
    const value = className[index]

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
}
