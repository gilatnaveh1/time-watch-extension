// background.js
let connectedToPopup = false;
chrome.runtime.onConnect.addListener(function () {
    console.log("Connected .....");
    if (!connectedToPopup) {
        connectedToPopup = true;
        chrome.runtime.onMessage.addListener(handleMessage);
    }
});

const handleMessage = async function (msg, sender) {
    if (!msg || msg.to !== "TW_BACKGROUND") {
        console.log("dropping message - not to me");
        return;
    }
    console.log("message received " + msg.body);
    switch (msg.body) {
        case "SET_REMINDER":
            await addAlarm(msg.date);
            return;
        case "START":
            const tab = await login();
            await addOnUpdatedListener(tab);
            return;
        case "FINISH":
            removeOnUpdateListener(sender);
            return
        default:
            console.log("dropping invalid message");
            return;
    }
}

const removeOnUpdateListener = function (tabId) {
    chrome.tabs.onUpdated.removeListener(arguments.callee)
}


const alarmName = "TimeWatchAlarm";
const addAlarm = async function (date) {
    let num = new Date(date).getTime();
    console.log("A reminder will be shown at " + new Date(date));
    chrome.alarms.create(alarmName, {when: num});
    await chrome.alarms.onAlarm.addListener(alarmListener);
};

async function alarmListener(alarm) {
    if (alarm.name !== alarmName) {
        return;
    }
    await chrome.alarms.clearAll();
    await chrome.alarms.onAlarm.removeListener(alarmListener);
    chrome.notifications.create('tw-monthly', {
        type: 'basic',
        requireInteraction: true,
        iconUrl: 'assets/images/icon512.png',
        title: 'Time watch puncher',
        message: 'It\'s time..',
        buttons: [{
            title: 'start'
        }]
    });
    await chrome.notifications.onButtonClicked.addListener(notificationListener);
    await chrome.notifications.onClosed.addListener(async ()=>{
        await addAlarm();
    });
}

async function notificationListener(notificationId, btnIdx) {
    if (notificationId === "tw-monthly") {
        if (btnIdx === 0) {
            await chrome.notifications.onButtonClicked.removeListener(notificationListener);
            const tab = await login();
            await addOnUpdatedListener(tab);
        }
        await addAlarm();
    }
}

const login = async function () {
    try {
        console.log("login - start");
        const tab = await chrome.tabs.create({
            url: 'https://checkin.timewatch.co.il/punch/punch.php',
            active: true
        });
        await ensureConditionIsSet(async () => {
            let tempTab = await chrome.tabs.get(tab.id);
            return tempTab.status === "complete";
        })
        await chrome.debugger.attach({tabId:tab.id}, "1.2", function(debugg) {
            chrome.debugger.sendCommand({tabId:tab.id}, "Input.dispatchMouseEvent",
                {
                    type:"mousePressed",
                    button: "left",
                    x:parseFloat("200"),
                    y:parseFloat("200")
                });
        });
        await chrome.scripting.executeScript(
            {
                target: {tabId: tab.id},
                files: ['inject-login.js'],
            });
        console.log("login - end");
        return tab;
    } catch (e) {
        console.log(e.message);
    }
}

const goToPunchData = async function (tabId) {
    console.log("goToPunchData - start");
    let tempTab = await chrome.tabs.get(tabId);
    while (tempTab.status !== "complete") {
        tempTab = await chrome.tabs.get(tabId);
    }
    await chrome.scripting.executeScript(
        {
            target: {tabId: tabId},
            files: ['inject-go-to-punch-data.js'],
        });

    console.log("goToPunchData - end");
}

const punchWholeMonth = async function (tabId) {
    await chrome.scripting.executeScript(
        {
            target: {tabId: tabId},
            files: ['inject-start.js'],
        });
}
const addOnUpdatedListener = async function (tab) {
    chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo) {
        if (tabId === tab.id && changeInfo.status && changeInfo.status === "complete") {
            const tab = await chrome.tabs.get(tabId);
            await chrome.debugger.detach({tabId});
            if (tab.url && tab.url.match(".*punch/punch2_e.php.*")) {
                await goToPunchData(tabId);
                return;
            }
            if (tab.url && tab.url.match(".*punch/editwh.php.*")) {
                await punchWholeMonth(tabId);
            }
        }
    });
}


async function ensureConditionIsSet(callback) {
    return new Promise(function (resolve) {
        (async function waitForFoo() {
            if (await callback() === true) return resolve();
            setTimeout(waitForFoo, 30);
        })();
    });
}
