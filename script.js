let CONFIG = {
    PREFER_TO_BE_BEFORE: new Date("2022-02-16"),
    LAST_NAME: 'X',
    LICENSE_NUMBER: 'X',
    KEYWORD: 'X',
    CITY: 'Richmond, BC',
    LOCATION: 'Richmond driver licensing'
}

let utils = {
    $: async (selector, text, retry = 0) => {
        let elements = document.querySelectorAll(selector);

        const filterWithText = () => {
            elements = Array.prototype.filter.call(elements, function (element) {
                return RegExp(text).test(element.textContent);
            });
        };
        text && filterWithText();

        if (elements.length >= 1) {
            return elements[0];
        } else if (retry < 100) {
            console.log(`retrying ${selector} ${text}`);
            await new Promise(resolve => setTimeout(resolve, 100));
            return await $(selector, text, retry + 1);
        } else {
            throw new Error(`Cannot find element ${selector} ${text}`);
        }
    },

    /**
     * Credit to https://github.com/bitwarden/browser
     */
    normalizeEvent: (el, eventName) => {
        let ev;
        if ('KeyboardEvent' in window) {
            ev = new window.KeyboardEvent(eventName, {
                bubbles: true,
                cancelable: false,
            });
        } else {
            ev = el.ownerDocument.createEvent('Events');
            ev.initEvent(eventName, true, false);
            ev.charCode = 0;
            ev.keyCode = 0;
            ev.which = 0;
            ev.srcElement = el;
            ev.target = el;
        }
        return ev;
    },

    /**
     * Credit to https://github.com/bitwarden/browser
     */
    setValueForElementByEvent: (el) => {
        const valueToSet = el.value,
            ev1 = el.ownerDocument.createEvent('HTMLEvents'),
            ev2 = el.ownerDocument.createEvent('HTMLEvents');

        el.dispatchEvent(utils.normalizeEvent(el, 'keydown'));
        el.dispatchEvent(utils.normalizeEvent(el, 'keypress'));
        el.dispatchEvent(utils.normalizeEvent(el, 'keyup'));
        ev2.initEvent('input', true, true);
        el.dispatchEvent(ev2);
        ev1.initEvent('change', true, true);
        el.dispatchEvent(ev1);
        el.blur();
        el.value !== valueToSet && (el.value = valueToSet);
    }
}

let ICBCSite = {
    login: async ({LAST_NAME: lastName, LICENSE_NUMBER: licenseNumber, KEYWORD: keyword}) => {
        // State: url is https://onlinebusiness.icbc.com/webdeas-ui/home
        const nextButton = await $('button', 'Next');
        nextButton.click();
        // State: url is https://onlinebusiness.icbc.com/webdeas-ui/login;type=driver

        const driverNameInput = await $('input[aria-label="driver-name"]');
        driverNameInput.value = lastName;
        utils.setValueForElementByEvent(driverNameInput);

        const driverLicenseInput = await $('input[aria-label="driver-licence"]');
        driverLicenseInput.value = licenseNumber;
        utils.setValueForElementByEvent(driverLicenseInput);

        const keywordInput = await $('input[aria-label="keyword"]');
        keywordInput.value = keyword;
        utils.setValueForElementByEvent(keywordInput);

        const agreementCheckbox = await $('input[type="checkbox"]')
        agreementCheckbox.click();

        const signInButton = await $('button', 'Sign in');
        signInButton.click();
    },

    pickLocation: async ({CITY, LOCATION}) => {
        const rescheduleButton = await $('button', 'Reschedule appointment');
        rescheduleButton.click();
        const yesButton = await $('mat-dialog-container button', 'Yes');
        yesButton.click();

        // State: url is https://onlinebusiness.icbc.com/webdeas-ui/booking
        const locationInput = await $('input[aria-label="Number"]');
        locationInput.value = CITY;
        locationInput.click();
        locationInput.focus();
        utils.setValueForElementByEvent(locationInput);

        const locationSpan = await $('span', CITY);
        locationSpan.click()  // select dropdown

        const searchButton = await $('button', 'Search');
        searchButton.click()  // select dropdown
        const departmentTitle = await $('.department-title', LOCATION)
        departmentTitle.click();
    },

    checkDate: async () => {
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
            let message = `Cannot find dom. Check the UI. ${e}`;
            console.error(message)
            alert(message);
            return;
        }

        if (dom.classList.contains(errorClass)) {
            console.log(`ICBC system error. Trying again...`);
        } else if (dom.classList.contains(noAppointmentMsgClass)) {
            console.log(`No appointment at the moment. Refreshing now...`);
        } else {
            const firstDateString = dom.innerText.replace(/(\d+)\w+,/, '$1,');
            const firstDate = await new Date(firstDateString);
            const result = firstDate < CONFIG.PREFER_TO_BE_BEFORE;
            console.log(`Earliest date: ${firstDate}. Refreshing now...`);
            if (result) {
                await ICBCSite.proceedWithBooking();
                const alertMessage = `BOOKED: ${firstDate}. NOW VERIFY THE EMAIL!!!!!`;
                console.log(alertMessage);
                setTimeout(() => {
                    alert(alertMessage);
                });
                return
            }
        }
        setTimeout(() => {
            ICBCSite.checkDate();
        });
    },

    proceedWithBooking: async () => {
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
}

var $ = utils.$;

await ICBCSite.login(CONFIG);
await ICBCSite.pickLocation(CONFIG);
await ICBCSite.checkDate();