# ICBC-Appointments-Auto-Booker

Trying to get those last-minute cancellation spots on ICBC? I know some people would check the website once every hour. But you can really just automate the whole process.

## New Method (+Auto Booking)
This method simply uses `Document.querySelector()` to trigger the click event, and get the text result from DOM.
1. Visit the [ICBC road test book site](https://onlinebusiness.icbc.com/webdeas-ui/home).
   ![](/pictures/console.png)
2. Copy the [script](/script.js), edit the `CONFIG`. Now paste and run it on DevTools -> Console
3. Once alert is triggered, it means the rescheduling has been submited! Now GO CHECK YOUR EMAIL AND FINISH THE VERIFICATION!
   ![](/pictures/found.png)
4. Good luck on your road test! And fuck ICBC examiners!

   
## Old Method
This method directly sends the network request. 
1. Install [Postman](https://www.postman.com/downloads/) and [Postman Interceptor](https://chrome.google.com/webstore/detail/postman-interceptor/aicmkgpgakddgnaphhhpliifpcfhicfo?hl=en)
2. Set up `Capture requests and cookeis` on Postman. Make sure to: sync and capture cookeis on `icbc.com`
   ![](/pictures/step2.png)
3. Now search the available test on [ICBC Website](https://onlinebusiness.icbc.com/webdeas-ui/booking). If you do it correctly, you should be able to see the `getAvailableAppointments` on Network requests.
   ![](/pictures/step3.png)
4. Copy the `getAvailableAppointments` request as `cURL (bash)`
   ![](/pictures/step4.png)
5. Import it to Postman as `Raw text`. Send it and you will get a HTTP 200 response.
   ![](/pictures/step5.png)
6. Copy the code snippet as `JavaScript - Fetch`
   ![](/pictures/step6.png)
7. Paste it on the `Console` tab. You will see it returns a list of schedules
   ![](/pictures/step7.png)
8. Now run my script
   ```Javascript
   // get an alert when found an appointment before the date below
   let preferToBeBefore = new Date("2022-06-01");
   let checkDate = () => fetch("https://onlinebusiness.icbc.com/deas-api/v1/web/getAvailableAppointments", requestOptions)
   .then(response => response.text())
   .then(result => JSON.parse(result))
   .then(oResult => {
       const foundDate = new Date(oResult[0]?.appointmentDt.date);
       const result = foundDate < preferToBeBefore
       console.log(`Earliest date: ${foundDate}; Less than ${preferToBeBefore}: ${result}`)
       if (result) {
           alert(`BOOK NOW: ${foundDate}`)
       } else {
           setTimeout(() => {
               checkDate();
           }, 0)
       }
   })
   .catch(error => console.log('error', error));

   checkDate();
   ````
9. Once alert is triggered, go reschedule the appointment ASAP! 
10. Good luck on your road test! And fuck ICBC examiners!
