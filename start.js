const modalBodySelector = 'body.modal-open';
window.fillCell = async function () {
    console.log('Filling cell');
    if ($(modalBodySelector).length > 0) {
        $('div#modalContainer .modal-content #ehh0').val('09');
        $('div#modalContainer .modal-content #emm0').val('00');
        $('div#modalContainer .modal-content #xhh0').val('18');
        $('div#modalContainer .modal-content #xmm0').val('00');
        $('div#modalContainer .modal-content button.btn.modal-popup-btn-confirm').get(0).click();
        await waitFor(() => $('div.jqi .jqiclose').css('display') !== 'block','waiting for spinner to disappear, current state: ' + $('div.jqi .jqiclose').css('display'));
    } else {
        console.log('no modal window was found');
    }
};

window.waitFor = async function (callback, message) {
    if (callback()) {
        return;
    }
    console.log(message);
    await new Promise(resolve => setTimeout(resolve, 200));
    await waitFor(callback, message);
};
window.start_process = async function () {
    if (!document.documentURI.indexOf('timewatch') > 0) {
        console.log(document.documentURI + 'is not valid for this extension');
        return;
    }
    let cell = $('td:contains("Entry/Exit missing")').get(0);

    if (!cell) {
        window.postMessage({to: 'TW_BACKGROUND', body: 'FINISH'}, '*');
        return;
    }
    if ($(modalBodySelector).length > 0) {
        console.log('found modal open');
        return;
    }
    cell.click();
    await waitFor(()=>$(modalBodySelector).length > 0, 'waiting for modal dialog to show up');
    console.log(`found ${$(modalBodySelector).length} modals`);
    await fillCell();

};
console.log('TimeWatch extension - start_process ');
window.start_process();
