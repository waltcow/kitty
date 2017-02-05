# debug with koa in chrome devtool

1. Node.js 6.3+ , Chrome 55+
2. Open the chrome://flags/#enable-devtools-experiments URL
   Enable the Developer Tools experiments flag
   Relaunch Chrome
   Open DevTools Setting -> Experiments tab (it started being visible after the reload)
   Press "SHIFT" 6 times to show the hidden experiments
   Check the "Node debugging" checkbox
   Open/close DevTools

3. node --inspect app.js

