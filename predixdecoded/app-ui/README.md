Microapp Seed
===

**Experimental**

This is a proof-of-concept for a microapp seed, using Node/Express and ES6/Babel/JSPM. It is based on the ES6 seed here: https://github.build.ge.com/seeds/es6-jspm.

## What's a microapp?

The first rule of building big single-page applications is, "don't build big single-page-applications." As some of our projects have grown, it has become clear that we need a way to break them into multiple, smaller single-page applications. For now, we're calling these "microapps".


### Important Note:

Within your microapp you must always use **RELATIVE URLS** with **NO LEADING SLASHES**!


**Good**
```
<script src="foo/bar">
```

**Bad**
```
<script src="/foo/bar">
```
In the second case, your microapp's path won't be prepended to the URL, resulting in a 404 or worse.

## Dependencies
*NOTE* Node version should be > 5.6, You can install stable nodejs from url https://nodejs.org/en/download/current/

If you haven't already done so, install JSPM & Bower
```
% sudo npm install -g jspm
% sudo npm install -g bower
% sudo npm install -g gulp
```

If you haven't already created an endpoint for Github, do so:
```
% jspm registry create hackathon jspm-github
% Are you setting up a GitHub registry? [yes]:yes
% Enter the hostname of your GitHub server:github.com
```

## Installation

Unset proxy
```
% unset HTTP_PROXY
% unset HTTPS_PROXY
% unset http_proxy
% unset https_proxy
% git config --global --unset http.proxy
% git config --global --unset https.proxy
```

Clone this repo
```
% git clone https://github.com/apmdev/apm-ext-microapp.git
```

Use JSPM and NPM to install all dependencies
```
% cd apm-ext-microapp
% npm install
% jspm install
% bower install
```
This will create `src/public/jspm_packages`, `src/public/bower_components` and `node_modules` folders.


Set ENV variables
```
Set ENV variables for AUTHTOKEN and TENANT before you start server locally. 
To get token and tenant info, download and import postman collection @
https://github.com/apmdev/tools/blob/master/service-apis.postman_collection.json and run init-environment
Copy value of admin.authorization from response of postman and set it to AUTHTOKEN as below.
Copy value of tenant.uuid from response of postman and set it to TENANT as below.

% export AUTHTOKEN="<your auth token>"
% export TENANT="<your tenant UUID>"

Uncomment line: "headers: myHeaders," in app.js to pass AUTHTOKEN and TENANT in headers to proxy function if you want to run locally
--------
app.use('/api/*', (req, res, next) => {
  proxy({
    url: assetPath + '/*',
    headers: myHeaders,
    timeout: parseInt(req.headers.timeout) || 3600000
  })(req, res, next);
});
-------
```

Start your server
```
% node app.js
```

This command compiles all the sass files to css and watches on any change in javascript, sass, html files.

Point your browser to http://localhost:9000. If you want to run the app on a different port, edit the "server" task in `app.js`

