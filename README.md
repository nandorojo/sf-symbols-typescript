# 🍏 SF Symbols for TypeScript

```ts
import { SFSymbol } from 'sf-symbols-typescript'

const icon: SFSymbol = 'arrow.up'
```

A simple TypeScript utility to get the names of SF Symbols. Mainly useful for React Native libraries and apps that utilize SF Symbols.

I made this for [Zeego](https://zeego.dev) and [Burnt](https://github.com/nandorojo/burnt).

## Installation

```sh
yarn add sf-symbols-typescript
```

## Usage

You can, if desired, import the entire list of symbols:

```ts
import { SFSymbol } from 'sf-symbols-typescript'

const icon: SFSymbol = 'arrow.up'
```

<!--
For optimal TS performance, you can use the getter:

```ts
import { SFSymbol } from 'sf-symbols'

const icon = SFSymbol('arrow.up')
``` -->

## Credits

This project is based on [Apple's SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols/overview/).

The names of the symbols were provided by [SFSymbols.com](https://SFSymbols.com/), so thanks to [Noah Sark](https://github.com/noahsark769/SFSymbols.com) for open sourcing that.

## Contributing

If you want to update the icons JSON, you can see the `data` folder. This is [forked](https://github.com/noahsark769/sfsymbols.com/tree/master/src/data) from `sfsymbols.com`.

1. Clone this repo
2. Update the JSON files in `data` if needed
3. You'll need to install Bun on your computer.
4. Run `bun run build`
5. Push your changes and open a PR

## Disclaimer

It's your responsibility to check Apple's rules about when certain icons can be used. You can check their website for more info. [SFSymbols.com](https://SFSymbols.com) is also a useful resource to see if any are marked as "restricted", but I can't guarantee what's correct and what isn't.

I am purposefully not displaying any icons themselves to avoid violating any licenses. This library isn't associated with Apple, and is only intended to expose the _names_ of the icons themselves.

## License

MIT License
