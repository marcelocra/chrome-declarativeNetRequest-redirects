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

Doesn't work :(.

Also, [seems
like](https://developer.chrome.com/docs/extensions/reference/api/webRequest#examples:~:text=The%20following%20example%20achieves%20the%20same%20goal%20in%20a%20more%20efficient%20way%20because%20requests%20that%20are%20not%20targeted%20to%20www.evil.com%20do%20not%20need%20to%20be%20passed%20to%20the%20extension%3A)
using "expanding" the `host_permissions` only in the filter doesn't really do
anything else.

I'll undo those changes in the code for the next cases (but case3 is already
saved).

### Case 4 - add `main_frame` type to filter object (see below)

### Other options that I still didn't try

#### declarativeNetRequest

Has potential, but seems like there's a hard limit for this set by Chrome itself
internally, and it's lower for redirections. See the [full documentation
here](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest#dynamic-rules),
relevant excerpt below:

> An extension can have at least 5000 dynamic rules. This is exposed as the
> MAX_NUMBER_OF_UNSAFE_DYNAMIC_RULES.
> 
> Starting in Chrome 121, there is a larger limit of 30,000 rules available for
> safe dynamic rules, exposed as the MAX_NUMBER_OF_DYNAMIC_RULES. Safe rules are
> defined as rules with an action of block, allow, allowAllRequests or
> upgradeScheme. Any unsafe rules added within the limit of 5000 will also count
> towards this limit.
> 
> Before Chrome 120, there was a 5000 combined dynamic and session rules limit.

To try it, there's [(bad)
documentation](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest#dynamic-and-session-rules)
in the Google Developers website and a code example in [this stackoverflow
post](https://stackoverflow.com/a/68752645/1814970) (partially reproduced below
for simplicity).

```js
const bannedHosts = ['amazon.com', 'youtube.com', 'netflix.com'];

chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: bannedHosts.map((h, i) => i + 1),
  addRules: bannedHosts.map((h, i) => ({
    id: i + 1,
    action: {type: 'redirect', redirect: {extensionPath: '/certBlockPage.html'}},
    condition: {urlFilter: `||${h}/`, resourceTypes: ['main_frame', 'sub_frame']},
  })),
});
```

(Other [stackoverflow
post](https://stackoverflow.com/questions/75858177/how-do-i-replace-chrome-webrequest-onbeforerequest-with-declarativenetrequest)
that mention some of these stuff and might be useful.)
