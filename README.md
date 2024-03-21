# Chrome Extension - Manifest v2 deprecation

## Problem

Manifest v2 was deprecated and has an ["end of life" timeline](https://developer.chrome.com/docs/extensions/develop/migrate/mv2-deprecation-timeline).

## Alternatives in a manifest v3

### Case 1 - blocking webRequest

Doesn't work. To use 'blocking' in a webResquest, we must use the webRequestBlocking permission, but it requires manifest version 2 or lower.

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

### Case 3 - use https://go/something to activate the extension

Activated the extension, but the redirect didn't work... not sure why.


### Case 3 - replace the `urls` filter with a `<all_urls>`

This is what [trotto](https://github.com/trotto/browser-extension/blob/89179e03152bb47e8573eb3d2be79f161b84f671/src/background/background.js#L18) does and it works for them. Granted, they are using manifest v2, 'blocking' and 'webRequestBlocking'.

Didn't work :/.

