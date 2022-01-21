let CONFIG = {
    PREFER_TO_BE_BEFORE: new Date("2022-04-26")
}

let proceedWithBooking = async ($) => {
    const firstTimeButton = await $('.dialog.container .mat-button-toggle-button');
    await firstTimeButton.click();

    const reviewAppointmentButton = await $('.dialog.container .mat-raised-button');
    await reviewAppointmentButton.click();

    await new Promise(resolve => setTimeout(resolve, 100));
    const nextButton = await $('.details .mat-raised-button');
    await nextButton.click();

    await new Promise(resolve => setTimeout(resolve, 100));
    const submitButton = await $('.mat-raised-button[type="submit"]');
    await submitButton.click();

    // Now landing on Verification page
}

let checkDate = async ($) => {
    const selectedLocationDom = await $('.background-highlight.clicked')
    if (!selectedLocationDom) {
        console.warn("Are you sure you already selected a location? There should be a yellowish background once you click on it");
        return
    } else {
        await selectedLocationDom.click();    // clicking on the location
    }

    const foundDateSelector = '.dialog.container .date-title';
    const noAppointmentMsgClass = 'no-appts-msg';
    const refreshingClass = 'searching';
    const errorClass = 'error-msg';
    let dom;
    try {
        do {
            await new Promise(resolve => setTimeout(resolve, 500));
            dom = await $(`${foundDateSelector}, .dialog.container .${noAppointmentMsgClass}, .dialog.container .${refreshingClass}, .dialog.container .${errorClass}`);    // wait for result to show
        } while (dom.classList.contains(refreshingClass))
    } catch (e) {
        console.warn(`Cannot find dom. Check the UI. ${e}`)
    }

    if (dom.classList.contains(errorClass)) {
        console.log(`ICBC system error. Trying again...`);
    } else if (dom.classList.contains(noAppointmentMsgClass)) {
        console.log(`No appointment at the moment. Refreshing now...`);
    } else {
        const firstDateString = dom.innerText.replace(/(\d+)\w+,/, '$1,');
        const firstDate = await new Date(firstDateString);
        const result = firstDate < CONFIG.PREFER_TO_BE_BEFORE;
        console.log(`Earliest date: ${firstDate}; Less than ${CONFIG.PREFER_TO_BE_BEFORE}: ${result}`);
        if (result) {
            await proceedWithBooking($);
            const alertMessage = `BOOKED: ${firstDate}. NOW VERIFY THE EMAIL!!!!!`;
            console.log(alertMessage);
            setTimeout(() => {
                alert(alertMessage);
            });
            return
        }
    }
    setTimeout(() => {
        checkDate($);
    });
}

checkDate($);