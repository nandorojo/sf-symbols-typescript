import symbols from '../data/symbols.json'
import restricedSymbols from '../data/restrictedSymbols.json'
import fs from 'fs'

let typeString = `export type SFSymbol =
`

typeString += symbols.map((symbol) => `  '${symbol}'`).join(' |\n')

typeString += restricedSymbols
  .map(
    (symbol) => ` | 
/** 
 * @restricted Usage restricted to ${symbol.feature}
 * 
 * @see https://developer.apple.com/design/human-interface-guidelines/foundations/sf-symbols#symbols-for-use-as-is
 */
'${symbol.symbolName}'`
  )
  .join('\n')

fs.writeFileSync('./dist/index.d.ts', typeString)

console.log('Wow, fast.')
