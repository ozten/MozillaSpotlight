# Mozilla Spotlight

Source Code for mozillaspotlight.com

## Problem

Not all community members get the spotlight.
We need a way to give everyone in the community a chance to share the awesome work they are doing.

## Solution

Mozilla Spotlight highlights Mozillians in random order, one per day.

## Design

### Spotlight Email

Once per day,
a script grabs a random email address from the Mozillians phonebook.

An email is sent,
inviting that person to record a video message and upload it.
They have the ear of the entire Mozillian community.
The email has examples of what to put in your video,
but it is entirely up to you.

The email suggests a deadline of 2 weeks.

The email includes an upload URL.
Mozillians can sign in with their Mozillians email address and put their video embed code in.

#### Implementation Details

Actually, several emails are chosen at random.
We send out more spotlight requests than one,
because sometimes people will fail to responder or fail to upload a video.

Once a Mozillian has been successfully spotlighted,
they are de-prioritized compared to the rest of the un-featured Mozillians.

### Spotlight Website
Everyday, there is a new Mozillian spotlighted on the homepage of MozillaSpotlight.com.
There is an RSS feed.
It is syndicated to planet.
Previous Spotlights are archived by date and paginated.

A spotlight has a name and a date. The title is usually the name + date. Internally it has an email address.

Examples:
* Asa Smith spotlighted 20131007
* Mozilla MX spotlighted 20131007

#### Reminder Emails
72 hour warning if we haven't seen an upload

## Known Issues

* No Localization
* No Video hosting
* No Automated Feedback