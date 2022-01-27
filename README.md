# ICBC-Appointments-Auto-Booker

Trying to get those last-minute cancellation spots on ICBC? I know some people would check the website once every hour. But you can really just automate the whole process.

## technical 
This method is kind of like selenium - it manipulates the DOM but all you need is running the script on Chrome DevTools. Part of the code snippet was taken from Bitwarden, a password managing extension, where they use the same technique to fill in the password on any website.

## how to run

1. Visit the [ICBC road test book site](https://onlinebusiness.icbc.com/webdeas-ui/home).
2. Open DevTools (Ctrl+Shift+J) on your favourite Chromium browser.
3. Run command (Ctrl+Shift+P), look for `Create new snippet`
4. Copy and paste the [script](/script.js) into the snippet that was created.
5. Edit the `CONFIG`. Fill in the login info and preferences.
6. Run the snippet (Ctrl+Enter)

Notice the page logs in itself? That's it! Now just leave the tab open. Turn up the volume, so you don't miss the alert. 

As soon as it catches a desired date, you will hear a tsunami alert, CONGRATS, you found a closer date! Now go check your email inbox and finish the verification on the page!

![](/pictures/found.png)
![](/pictures/record.png)

Good luck on your road test! Either have your ass kicked or kick the examiner's ass!
