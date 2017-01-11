# tweetsinworld


The objective of this project is to display the position of the tweets that have geolocation in the world in real time.


# Installation

First of all, download all the dependencies of the project.

```
npm install
```

Then, rename **config/api.js.default** to **config/api.js** and indicate your credentials for the twitter api.
``` javascript
module.exports.api = {
    twitter: {
        consumer_key: '<CONSUMER KEY>',
        consumer_secret: '<CONSUMER_SECRET>',
        access_token_key: '<ACCESS_TOKEN_KEY>',
        access_token_secret: 'ACCESS_TOKEN_SECRET'
    }
};
```

Run the server:
```
node app.js
```

The server will run on the port 1337 by default
