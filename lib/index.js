/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').ElementContent} ElementContent
 * @typedef {import('hast').Root} Root
 *
 * @typedef {import('lowlight').LanguageFn} LanguageFn
 *
 * @typedef {import('vfile').VFile} VFile
 */

/**
 * @typedef Options
 *   Configuration (optional).
 * @property {Record<string, Array<string> | string> | null | undefined} [aliases={}]
 *   Register more aliases (optional); passed to `lowlight.registerAlias`.
 * @property {boolean | null | undefined} [detect=false]
 *   Detect the programming language on code without a language class (default:
 *   `false`).
 * @property {boolean | null | undefined} [ignoreMissing=false]
 *   Swallow errors for missing languages (default: `false`); unregistered
 *   syntaxes normally throw an error when used; pass `ignoreMissing: true` to
 *   swallow those errors and ignore code with unknown code languages.
 * @property {Record<string, LanguageFn> | null | undefined} [languages={}]
 *   Register more languages (optional); each key/value pair passed as arguments
 *   to `lowlight.registerLanguage`.
 * @property {Array<string> | null | undefined} [plainText=[]]
 *   List of plain-text languages (optional); pass any languages you would like
 *   to be kept as plain-text instead of getting highlighted.
 * @property {string | null | undefined} [prefix='hljs-']
 *   Prefix to use before classes (default: `'hljs-'`).
 * @property {Array<string> | null | undefined} [subset]
 *   Scope of languages to check when auto-detecting (optional); when not
 *   passed, all registered languages are checked.
 */

import {toText} from 'hast-util-to-text'
import {common, createLowlight} from 'lowlight'
import {visit} from 'unist-util-visit'

/** @type {Options} */
const emptyOptions = {}

/**
 * Highlight programming code with lowlight (`highlight.js`).
 *
 * @param {Readonly<Options> | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export default function rehypeHighlight(options) {
  const settings = options || emptyOptions
  const aliases = settings.aliases
  const detect = settings.detect || false
  const ignoreMissing = settings.ignoreMissing || false
  const languages = settings.languages || common
  const plainText = settings.plainText
  const prefix = settings.prefix
  const subset = settings.subset
  let name = 'hljs'

  const lowlight = createLowlight(languages)

  if (aliases) {
    lowlight.registerAlias(aliases)
  }

  if (prefix) {
    const pos = prefix.indexOf('-')
    name = pos > -1 ? prefix.slice(0, pos) : prefix
  }

  /**
   * Transform.
   *
   * @param {Root} tree
   *   Tree.
   * @param {VFile} file
   *   File.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree, file) {
    visit(tree, 'element', function (node, _, parent) {
      if (
        node.tagName !== 'code' ||
        !parent ||
        parent.type !== 'element' ||
        parent.tagName !== 'pre'
      ) {
        return
      }

      const lang = language(node)

      if (
        lang === false ||
        (!lang && !detect) ||
        (lang && plainText && plainText.includes(lang))
      ) {
        return
      }

      if (!Array.isArray(node.properties.className)) {
        node.properties.className = []
      }

      if (!node.properties.className.includes(name)) {
        node.properties.className.unshift(name)
      }

      /** @type {Root} */
      let result

      try {
        result = lang
          ? lowlight.highlight(lang, toText(parent), {prefix})
          : lowlight.highlightAuto(toText(parent), {prefix, subset})
      } catch (error) {
        const exception = /** @type {Error} */ (error)

        if (
          lang &&
          (!ignoreMissing || !/Unknown language/.test(exception.message))
        ) {
          file.fail('Cannot highlight as `' + lang + '`, it’s not registered', {
            ancestors: [parent, node],
            cause: exception,
            place: node.position,
            ruleId: 'missing-language',
            source: 'rehype-highlight'
          })
        }

        return
      }

      if (!lang && result.data && result.data.language) {
        node.properties.className.push('language-' + result.data.language)
      }

      if (result.children.length > 0) {
        node.children = /** @type {Array<ElementContent>} */ (result.children)
      }
    })
  }
}

/**
 * Get the programming language of `node`.
 *
 * @param {Element} node
 *   Node.
 * @returns {false | string | undefined}
 *   Language or `undefined`, or `false` when an explikcit `no-highlight` class
 *   is used.
 */
function language(node) {
  const className = node.properties.className
  let index = -1

  if (!Array.isArray(className)) {
    return
  }

  while (++index < className.length) {
    const value = String(className[index])

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
