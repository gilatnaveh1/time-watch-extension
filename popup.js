const port = chrome.extension.connect({
    name: "Sample Communication"
});

const button = document.getElementById('start');
button.addEventListener('click', async function () {
    console.log("Checking is url is supported");
    const ctab = await getCurrentTab()
    if (ctab && ctab.url.match("https://checkin.timewatch.co.il/punch/editwh.php.*").length > 0) {
        console.log("url is supported");
        port.postMessage({to: "TW_BACKGROUND", body: "START", tabId : ctab.id });
    } else {
        console.log("url is NOT supported");
    }

});


const getCurrentTab = function () {
    let queryOptions = {active: true, currentWindow: true};
    return new Promise((resolve, reject) => {
        chrome.tabs.query(queryOptions, (tabs) => {
            resolve(tabs[0])
        });
    });
};