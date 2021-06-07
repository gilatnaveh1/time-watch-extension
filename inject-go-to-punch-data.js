console.log('Injecing update punch data');
var s = document.createElement('script');
s.src = chrome.runtime.getURL('go-to-punch-data.js');
s.onload = function () {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);