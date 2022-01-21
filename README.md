# ICBC-Appointments-Auto-Booker

Trying to get those last-minute cancellation spots on ICBC? I know some people would check the website once every hour. But you can really just automate the whole process.

## New Method (+Auto Booking)
This method simply uses `Document.querySelector()` to trigger the click event, and get the text result from DOM.
1. Visit the [ICBC road test book site](https://onlinebusiness.icbc.com/webdeas-ui/home).
   ![](/pictures/console.png)
2. Copy the [script](/script.js), edit the `CONFIG`. Now paste and run it on DevTools -> Console
3. Now just leave the tab open. Turn up the volume, so you don't miss the alert. 
4. Once you hear the scary alert, CONGRATS, you found a closer date! Now go check your email inbox and finish the verification on the page!
   ![](/pictures/found.png)
5. Good luck on your road test!