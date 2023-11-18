import fs from 'fs'
import path from 'path'
import plist from 'plist'

// these are how SF Symbols releases are referenced internally
const releaseNames = [
  '2019',
  '2019.1',
  '2020',
  '2020.1',
  '2020.2',
  '2021',
  '2021.1',
  '2021.2',
  '2021.3',
  '2022',
  '2022.1',
  '2022.2',
  '2023',
] as const

type ReleaseName = (typeof releaseNames)[number]
type Symbol = string & {}
type SupportTable = {
  iOS: string
  macOS: string
  tvOS: string
  visionOS: string
  watchOS: string
}

function readPlist<T>(filename: string) {
  const data = fs.readFileSync(
    path.resolve(__dirname, './data', filename),
    'utf8'
  )
  return plist.parse(data) as T
}

const NameAvailabilityPlist = readPlist<{
  symbols: Record<Symbol, ReleaseName>
  year_to_release: Record<ReleaseName, SupportTable>
}>('name_availability.plist')

const symbolsByRelease = Object.entries(NameAvailabilityPlist.symbols).reduce(
  (acc, [symbol, release]) => {
    acc[release].push(symbol as Symbol)
    return acc
  },
  Object.fromEntries(releaseNames.map((release) => [release, [] as Symbol[]]))
) as Record<ReleaseName, Symbol[]>

function getPublicVersion(releaseName: ReleaseName) {
  const [year, minorVersion = '0'] = releaseName.split('.')
  const majorVersion = Number(year) - 2018 // 2019 -> 1, 2020 -> 2, etc.
  return `${majorVersion}.${minorVersion}`
}

function getTypeName(releaseName: ReleaseName) {
  return `SFSymbols${getPublicVersion(releaseName).replace(/\./g, '_')}`
}

let lastRelease: ReleaseName | undefined
const versionedTypes = releaseNames
  .map((release) => {
    const symbols = symbolsByRelease[release]
    const supportTable = NameAvailabilityPlist.year_to_release[release]

    let versionType = `/**
 * @name SF Symbols ${getPublicVersion(release)}
 * @description These symbols are available on the following platforms:
 * iOS v${supportTable.iOS}+,
 * macOS v${supportTable.macOS}+,
 * tvOS v${supportTable.tvOS}+,
 * visionOS v${supportTable.visionOS}+,
 * watchOS v${supportTable.watchOS}+
 */
export type ${getTypeName(release)} =\n`

    if (lastRelease) {
      versionType += `  | ${getTypeName(lastRelease)}\n`
    }

    versionType += symbols.map((symbol) => `  | '${symbol}'`).join('\n')

    lastRelease = release

    return versionType
  })
  .join('\n\n')

const conditionalType = `export type SFSymbol =
${releaseNames
  .map((release) => {
    const typeName = getTypeName(release)
    return `  '${getPublicVersion(
      release
    )}' extends Overrides['SFSymbolsVersion'] ? ${typeName} :`
  })
  .join('\n')}
  never`

const latestReleaseVersion = getPublicVersion(
  releaseNames[releaseNames.length - 1]
)

const source = `export interface Overrides {
  /**
   * Override this interface to limit the SFSymbol types to symbols available in a specific version.
   * 
   * @type {${releaseNames
     .map((release) => `"${getPublicVersion(release)}"`)
     .join(' | ')}}
   * @default "${latestReleaseVersion}"
   */
  SFSymbolsVersion: '${latestReleaseVersion}'
}

${versionedTypes}

${conditionalType}
`

fs.writeFileSync('./dist/index.d.ts', source)

console.log('Wow, fast.')
