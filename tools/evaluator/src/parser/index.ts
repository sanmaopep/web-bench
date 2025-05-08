// export

import { HTMLParser } from './html'
import { CodeParser } from './type'

const parsers: CodeParser[] = [new HTMLParser()]

export const fileValidate = (filepath: string, code: string): string => {
  const suffix = filepath.split('.').pop() || ''

  const parser = parsers.find((p) => p.suffix.includes(suffix))

  if (parser) {
    return parser.validate(code)
  }
  return ''
}
