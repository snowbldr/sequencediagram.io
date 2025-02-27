[![Build Status](https://travis-ci.org/Enselic/sequencediagram.io.svg?branch=master)](https://travis-ci.org/Enselic/sequencediagram.io)
[![Coverage Status](https://coveralls.io/repos/github/Enselic/sequencediagram.io/badge.svg?branch=master)](https://coveralls.io/github/Enselic/sequencediagram.io?branch=master)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.png?v=103)](https://opensource.org/licenses/mit-license.php)

https://sequencediagram.io
==========================

Pleasurably create simple and sharable sequence diagrams directly in the browser.


Why this project exists
=======================

I wanted there to be a pleasurable way to create simple sequence diagrams.
For instance, adding three objects to a diagram should be at most three clicks,
and removing three objects from a diagram should also be at most three clicks.
Most other software suffers from feature bloat, causing even even basic diagram operations
to require several interactions.


Target audience
===============

Software developers sitting at their desktop using modern browsers with an internet connection, and they
already know what a sequence diagram is. If they want to use the site while offline, they can clone
the code from GitHub beforehand and then run on localhost as per instructions in this README.

Important design points
-----------------------

* It is important that when the user is idle, the diagram shown is without controls.
This is so that when the diagram is edited, it looks clean and pretty when just viewed. And we don't want to complicate the UI with an "enter view mode" concept.


Roadmap
=======

The current feature set is minimal but useful.
Here is a list of features that I plan on adding later, roughly sorted by descending priority.
Contributions of any kind are very welcomed however!

High prio
---------
- Redo UI; make diagram elements selectable, and show controls upon selection, not hover.
- Support visualization of so called found/lost messages, i.e. messages originating form/ending in a circle

Low prio
--------
- Support adding a title to the diagram (sketch: https://github.com/Enselic/sequencediagram.io/tree/add-title)
- Support adding arbitrary comments to the diagram
- Support changing appearance of an object from a filled rect to e.g. a stick figure
- Let the user add so called activation boxes to lifelines to represent processing
- Make Object movable vertically to represent creation
- Allow X-es to be added to lifelines, representing object destruction
- Support touch-based editing of diagrams in a good way (must not interfer with primary audience using mouse input however)
- Integrate with user accounts from other services to allow user accounts to take ownership of diagrams


Setting up for development
==========================

It should work to git clone this repo and then run `npm start` after `npm install`.
To run the automated tests it should work to run `npm test` while `npm start` is
running, assuming you have regular Google Chrome and Firefox installs.

Visual Studio Code
------------------

First launch Google Chrome with `google-chrome --remote-debugging-port=9222`.
Then open up the project in vscode with `code sequencediagram.io/`. Now you
should be able to set breakpoints, launch, debug, etc (after `npm start` as per
above), after installing the `Debugger for Chrome` vscode extension.

Folder structure and technology
----------------------------

```
public/
src/
Web app using React (via create-react-app) and Redux

src-backend/
src-backend-mock/
NodeJS backend using AWS Lambda, AWS API Gateway, AWS DynamoDB, with localhost wrappers

src/__tests__/end-to-end/
Automated and high level tests of both the web app and backend using selenium-webdriver

scripts-ci/
Scripts used by CI.
```

AWS Deploy info
---------------

If you want to deploy to AWS yourself, here are some incoherent and incomplete key steps:

1. aws lambda create-function --function-name SequenceDiagramIo-BackendApiHandler-GitMaster --runtime nodejs12.x --role arn:aws:iam::123456789012:role/SequenceDiagramIo-BackendApiHandlerLambda --handler backend-api-aws-lambda-function.build.handler --description "Handles api.sequencediagram.io/git-master requests" --memory-size 128 --publish --zip-file fileb:///path/to//foo2.zip

1. Deploy `build-backend/aws-lambda-handler-build.js` to an `AWS Lamda` function
   with `runtime: "nodejs6.10"` and `handler_name: "handler"` and a role with
   permissions as per below
2. Create an `AWS DynamoDB` table. See `backend/dynamodb-utils.js` for details
3. Import `backend/swagger.json` to `AWS API Gateway` and deploy to a stage with
   the stage variables `lambdaFunction=<name of function in step 1>` and
   `tableName=<name of table in step 2>`
4. Deploy `build-deploy` to `AWS S3` and enable static site serving. NOTE: It is important
   that e.g. HTTP 403 and 404 is redirected to HTTP 200 /index.html so that it is possible
   to share links to diagrams with e.g. the following URL: https://sequencediagram.io/yj5nHiXedV

AWS Lambda function role permissions:
```
SequenceDiagramIoApiDynamoDbPutAndQuery
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:Query"
            ],
            "Effect": "Allow",
            "Resource": "arn:aws:dynamodb:eu-west-1:nnnnnnnnnnnn:table/io.sequencediagram.dynamodb.*"
        }
    ]
}
```


TODO
====

List of minor/uninteresting things to do, roughly sorted by priority.

High prio
---------
- redo UI for objects; make it possible to insert Objects at any position, not just end

Low prio
--------
- redo UI for messages; make it less boxy and more accurate
- Make messages movable when grabbing buttons (like Pavel expected)
- Add move right/left buttons in the UI so users don't have to figure out drag and drop
- Add link to release notes in message about new version
- Fade in controls slowly to reduce flicker (as requested by Pavel)
- make it easy to 'fork' a diagram
- Make tab switch objects
- Make <input /> show as multiline when the layout will wrap lines. Use <textarea /> ?
- Make messages movable horizontally
- Add .svg URL to service worker and serve SVG normally
