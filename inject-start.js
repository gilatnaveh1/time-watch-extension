chrome.runtime.sendMessage({to: "TW_BACKGROUND", body: "FINISH"});

var input = document.createElement('input');
input.name  = "timeWatchExtensionId";
input.value = chrome.runtime.id;
(document.head || document.documentElement).appendChild(input);


var s = document.createElement('script');
s.src = chrome.runtime.getURL('start.js');
s.onload = function () {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);