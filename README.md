# Auth0 - Applications & Rules example

This is a demo application displaying applications and related rules on Auth0.

All the logic related to retrieving applications and rules is on the file
lib/appsAndRulesHelper.js.


We need to initialize the helper with our AUTH0_DOMAIN and management API token.

The token scope must have at least read permissions for clients and rules:

scopes: {
    clients: { actions: ['read'] },
    rules: { actions: ['read'] },
}

You can use the token generator from the Auth0 management API explorer to create such a token.

Once created the token you must create a .env file with the following properties on it:

````bash
# .env file
AUTH0_CLIENT_ID=myCoolClientId
AUTH0_CLIENT_SECRET=myCoolSecret
AUTH0_DOMAIN=myCoolDomain
AUTH0_CALLBACK_URL=myCallbackUrl
AUTH0_APP_RULES_TOKEN=YourGeneratedToken
````

Once you've set those 5 environment variables, just run `npm start` and try calling [http://localhost:3000/](http://localhost:3000/)
