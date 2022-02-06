setTimeout(() => {
    $("b:contains('Update punch data')").trigger('click');
    const extensionId =  $("input[name='timeWatchExtensionId']")[0].value
    console.log(`go-to-punch-data to extension ${extensionId}`)
    const goUrl = $("b:contains('Update punch data'):parent").parent("a").prop("href");
    chrome.runtime.sendMessage(extensionId,{to: "TW_BACKGROUND", body: "URL", message: goUrl});
}, 300);
