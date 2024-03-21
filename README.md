<!-- vim: fen:ai:et:ts=4:sw=4:filetype=markdown:tw=80
-->

# Chrome Extension - Manifest v2 deprecation

## Problem

Manifest v2 was deprecated and has an ["end of life"
timeline](https://developer.chrome.com/docs/extensions/develop/migrate/mv2-deprecation-timeline).

## Alternatives in a manifest v3

### Case 1 - blocking webRequest

Doesn't work. To use 'blocking' in a webResquest, we must use the
webRequestBlocking permission, but it requires manifest version 2 or lower.

For this, we had:

```
// manifest.json

"permissions": [
    "webRequest",
    "webRequestBlocking"
]

"host_permissions": [
    "*://go/*"
]

// sw.js

chrome.webRequest.onBeforeRequest.addListener(
    function beforeWebRequest(details, callback) {
        // ...
    },
    { urls: ['*://go/*'] },
    ['blocking']
);

```

### Case 2 - remove the webRequestBlocking permission and the 'blocking' from onBeforeRequest third parameter array

Doesn't give an error, but doesn't work either. So far I've been using:

```
// manifest.json

"host_permissions": [
    "*://go/*"
]

// sw.js

chrome.webRequest.onBeforeRequest.addListener(
    function beforeWebRequest(details, callback) {
        // ...
    },
    { urls: ['*://go/*'] },
);
```

### Case 2b - same code as case 2, but trying the full url to activate the extension

From [trotto's
documentation](https://github.com/trotto/browser-extension/blob/89179e03152bb47e8573eb3d2be79f161b84f671/README.md?plain=1#L120-L125),
seems like Chrome needs to learn how to deal with https://go/ "hostnames", as
they are not common.

They do this automatically through their code, but we can simulate it by simply
using https://go/something.

This does activate the extension, but without doing the redirecting. Still not
sure why.

My hypothesis is that the problem is in the `urls: ... go` part. Let's try to
change that.

### Case 3 - replace the `urls` filter with `<all_urls>`

This is what
[trotto](https://github.com/trotto/browser-extension/blob/89179e03152bb47e8573eb3d2be79f161b84f671/src/background/background.js#L18)
does and seems to works for them. Granted, they are stil using manifest v2,
'blocking' and 'webRequestBlocking'.


