# IICM2023

## How to update `firebase.js` file:
1. `npm install`
2. Make changes to index.js
3. `npm run build`
4. Open the HTML file in a browser

## ToDo:

### CSS Check
Check all CSS one last time, and make any last changes if needed.

### .env file with dotenv package
Try and see if it works. If it does hurray. If it doesn't then bite the bullet and host it privately somewhere.

In case you are able to get webpack to work without errors. Check WhatsApp for the actual values.

Note: I have removed `dotenv` from dependencies, so you will need to install using `npm`.

#### Template .env file
```dotenv
API_KEY = "",
AUTH_DOMAIN = "",
PROJECT_ID = "",
STORAGE_BUCKET = "",
MESSAGING_SENDER_ID = "",
APP_ID = "",
MEASUREMENT_ID = ""
```

#### Template js
```js
require('dotenv').config();

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};
```

Replace the following line (Line 3):
```js
import {firebaseConfig} from './firebaseConfig.js';
```
with the above js if it works.

## Garbage Code
Please improve if time, its 2 AM and I am writing garbage code.