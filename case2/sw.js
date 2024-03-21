chrome.webRequest.onBeforeRequest.addListener(
    function beforeWebRequest(details) {
        console.log('before request to:');
        console.log(details);

        return { 
            redirectUrl: 'https://google.com'
        };
    },
    { urls: ['*://go/*'] },
);

chrome.webRequest.onCompleted.addListener(
    function beforeWebRequest(details) {
        console.log('completed!');
        console.log(details);
    },
    { urls: ['*://go/*'] },
);
