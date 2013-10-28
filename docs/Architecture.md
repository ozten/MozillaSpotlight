# Architecture

Mozilla Spotlight is a failry lightweight website and has the following architecture:

## Static Files
Most of the website is static and is re-built by cronjobs.

The homepage, archived spotlights, and the RSS feed are all static.

## Cronjob

Daily we do the following tasks:
* Invitation email to community members
* Reminder email to people who haven't finished their submission
* Schedule spotlights
* Publish HTML for homepage and archive previous spotlights

## Dynamic Application
* Authenticate users
* Video submission workflow

A fraction of the traffic comes to this dynamic portion of the website.

## Database
The Cronjob and Dynamic application use a DB.