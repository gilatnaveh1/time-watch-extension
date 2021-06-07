const port = chrome.runtime.connect({
    name: "Sample Communication"
});
const displayReminder = false;
if(displayReminder) {
    const reminderButton = document.getElementById('reminder');
    chrome.storage.sync.get("showReminder", (items) => {
        if (items.showReminder !== "false") {
            reminderButton.style.display = "block";
        }
    });
}

reminderButton?.addEventListener('click', async function () {
    chrome.runtime.sendMessage({to: "TW_BACKGROUND", body: "SET_REMINDER"});
    await chrome.storage.sync.set({showReminder: "false"});
    window.close();
});


document.getElementById('start')?.addEventListener('click', async function () {
    const ctab = await getCurrentTab()
    chrome.runtime.sendMessage({to: "TW_BACKGROUND", body: "START", tabId: ctab.id});
});


const getCurrentTab = function () {
    let queryOptions = {active: true, currentWindow: true};
    return new Promise((resolve, reject) => {
        chrome.tabs.query(queryOptions, (tabs) => {
            resolve(tabs[0])
        });
    });
};