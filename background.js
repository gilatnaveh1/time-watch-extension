// background.js
let firstTime = true;
chrome.extension.onConnect.addListener(function (port) {
    console.log("Connected .....");
    if (firstTime) {
        addListener(port);
    }
});

let lastTabId;
function addListener(port) {
    port.onMessage.addListener(function (msg) {
        if (!msg || msg.to !== "TW_BACKGROUND") {
            console.log("dropping invalid message");
        }
        console.log("message recieved " + msg.body);
        addOnUpdatedListener(msg.tabId);
        chrome.tabs.executeScript(msg.tabId, {file: 'content-script.js'});
    });
}

const addOnUpdatedListener = function (id) {
    if (!lastTabId) {    //first time
        chrome.tabs.onUpdated.addListener(handleUpdated);
    }
    lastTabId = id;
}


const handleUpdated = function (tabId, changeInfo, tabInfo) {
    if (tabId !== lastTabId) {
        return;
    }
    if(changeInfo.status && changeInfo.status == "complete"){
        console.log(`Updated tab: ${tabId}`);
            chrome.tabs.executeScript(tabId, {file: 'content-script.js'});
    }
}