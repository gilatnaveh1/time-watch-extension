let displayReminder = true;

const port = chrome.runtime.connect({
    name: "Sample Communication"
});
window.onload = async ()=>{
    console.log("onload");
    const reminderButton = document.getElementById('reminder');
    if(displayReminder) {
        const twAlarm = await chrome.alarms.get("TimeWatchAlarm");
        if(!twAlarm){
            reminderButton.style.display = "block";
        }
        /*chrome.storage.sync.get("showReminder", (items) => {});*/
    }


reminderButton?.addEventListener('click', async function () {
    let date = new Date();
    date.setMonth(date.getDay() >= 21 ? date.getMonth() + 1 : date.getMonth());
    date.setDate(21);
    date.setHours(14,0,0,0);
    const answer = confirm("A reminder will be shown at " + new Intl.DateTimeFormat('en-GB').format(date));
    if(answer){
        chrome.runtime.sendMessage({to: "TW_BACKGROUND", body: "SET_REMINDER", date});
        displayReminder = false;
    }

    window.close();
    // await chrome.storage.sync.set({showReminder: "false"});
});


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