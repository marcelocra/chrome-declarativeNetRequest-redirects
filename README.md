# Chrome Extension - Manifest v2 deprecation

## Problem

Manifest v2 was deprecated and has an ["end of life" timeline](https://developer.chrome.com/docs/extensions/develop/migrate/mv2-deprecation-timeline).

## Alternatives in a manifest v3

### Case 1 - blocking webRequest

Doesn't work. To use 'blocking' in a webResquest, the webRequestBlocking permission must be used and it requires manifest version 2 or lower.

### Case 2 - webRequest without blocking



