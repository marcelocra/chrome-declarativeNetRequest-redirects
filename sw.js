chrome.webRequest.onBeforeRequest.addListener(
    function beforeWebRequest(details, callback) {
        console.log('before request to:');
        console.log(details.url);
    },
    { urls: ['*://go/*'] },
    ['blocking']
);

chrome.webRequest.onCompleted.addListener(
    function beforeWebRequest(details, callback) {
        console.log('completed!');
    },
    { urls: ['*://go/*'] },
    ['blocking']
);
