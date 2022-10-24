setTimeout(() => {
    const updateLink = $("div.edit-info a:contains('Update attendance data')")[0];
    updateLink.click();
    const extensionId =  $("input[name='timeWatchExtensionId']")[0].value
    console.log(`go-to-punch-data to extension ${extensionId}`)
    const goUrl = updateLink.href;
   window.postMessage({to: "TW_BACKGROUND", body: "URL", message: goUrl}, '*');
}, 300);
