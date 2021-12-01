let displayReminder = true;

const port = chrome.runtime.connect({
    name: "Sample Communication"
});


const handleMessage = async function (msg, sender) {
    if (!msg || msg.to !== "TW_POPUP") {
        console.log("dropping message - not to me");
        return;
    }
    console.log("message received " + msg.body);
    switch (msg.body) {
        case "RM_REMINDER_BUTTON":
            await removeButton(msg.message);
            return;
        default:
            console.log("dropping invalid message");
            return;
    }
}

chrome.runtime.onMessage.addListener(handleMessage);


async function removeButton(msg) {
    const reminderButton = document.getElementById('reminder');
    reminderButton.style.display = "none";
    alert(msg);
    window.close();
}

const reminderButtonEventListener = function () {
    console.log("Clicked!!")
    chrome.runtime.sendMessage({to: "TW_BACKGROUND", body: "SET_REMINDER"});
};

window.onload = async () => {
    console.log("onload");
    const reminderButton = document.getElementById('reminder');
    if (displayReminder) {
        const twAlarm = await chrome.alarms.get("TimeWatchAlarm");
        if (!twAlarm) {
            reminderButton.style.display = "block";
        }
        reminderButton.addEventListener("click", reminderButtonEventListener);
        /*chrome.storage.sync.get("showReminder", (items) => {});*/
    }


    document.getElementById('start')?.addEventListener('click', async function () {
        const ctab = await getCurrentTab()
        chrome.runtime.sendMessage({to: "TW_BACKGROUND", body: "START", tabId: ctab.id});
    });


};

const getCurrentTab = function () {
    let queryOptions = {active: true, currentWindow: true};
    return new Promise((resolve, reject) => {
        chrome.tabs.query(queryOptions, (tabs) => {
            resolve(tabs[0])
        });
    });
};
