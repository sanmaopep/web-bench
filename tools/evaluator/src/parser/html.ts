import { parse } from 'node-html-parser'
import { CodeParser } from './type'

export enum HTMLParserError {
  FullHTML = 'Please enter the full HTML codeblock with filename in the language specifier.',
}

export class HTMLParser implements CodeParser {
  suffix: string[] = ['html', 'htm']

  validate(content: string) {
    const root = parse(content)

    const hasHTMLNode = root.childNodes.find(
      (c) => c.rawTagName === 'html' || c.rawTagName === 'body'
    )

    if (hasHTMLNode) {
      return ''
    }
    return HTMLParserError.FullHTML
  }
}
