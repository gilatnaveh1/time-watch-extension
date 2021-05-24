window.start_process = function() {
    if (!document.documentURI.indexOf("timewatch") > 0) {
        console.log(document.documentURI + "is not valid for this extension");
        return;
    }
    window.openWin = function (url, title, attrib) {
        console.log("window opening ....");
        const wref = window.open(url, title, attrib);

        if (title == "map" || title == "sig") {
            wref.moveTo(0, 0);
            wref.resizeTo(screen.width, screen.height);
        }
        window.update_popup = wref;

    };
    let cell = $('font:contains("Missing In/Out")').get(0);
    console.log("Filling cell");
    if(typeof cell !== "undefined"){
        cell.click();
        window.popup_window_loaded = window.setInterval(function () {
            if (window.update_popup && window.update_popup.document.querySelector('input[name="B1"]')) {
                $('#ehh0', window.update_popup.document).val('09');
                $('#emm0', window.update_popup.document).val('00');
                $('#xhh0', window.update_popup.document).val('18');
                $('#xmm0', window.update_popup.document).val('00');
                $('input[name="B1"]', window.update_popup.document).click();
                window.clearInterval(window.popup_window_loaded);
            }
        }, 200);
    }
}
console.log("TimeWatch extension - start_process ");
 window.start_process();