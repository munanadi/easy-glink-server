# G-Calendar link Creator

Given a list of Events -> Time and Date. Spits out a G Calendar link to add events to your calendar

0. ~~Setup Keys if required from your account.~~
1. Input a file with event(s)
2. Create a Event(s) in calendar
3. Creat a shareable link

---

NOTES:

4. Creating an API Key cause only I will run this anywayt
5. Create a GCloud Project and enable Calendar API [here](https://console.cloud.google.com/apis/library/calendar-json.googleapis.com)
6. Looks like I need to authorize Creds for a web app too. Okay
7. To access user data in your app. Create OAuth 2.0 Client IDs. One Client ID referes to one app in G's OAuth servers. One app, one ID. Multiple platforms. Multiple IDs are required then.
8. Created a OAuth consent screen first. Test users and scopes are added here
9. Added all scopes for now, maybe later remove some if not needed.
10. create the oauth id.
11. Client side apps -> Authorized JavaScript origins, Server side apps -> Authorized redirect URIs. Enter URLs that will reach this point. `/oAuthCallback` register this as the callback in the console.
12. Throws me to a browser to authorize adn then on produces a `token.json` for repeated access later.
13.

- I would need to create a new calendat calling it the "H Kirat Calendar" and Can have events under them
- Calendars can have multiple owners id'ed by ID -> email id
- Event objct identified by specific time range or date . Unique ID.
  - Single or reccuring
  - Recurring events can have different times but they are reccuring. ex. meetings
  - timed -> start.dateTime and end.dateTime
  - all-day -> start.date and end.date
- Events will have a single Organizer (Calendar with the main copy of the event.(an email id))
- Primary calendar always there. Multiple can be created, edited and shared.
- Calendar's collection ->
  - all existing calendars
  - create, delete
- Calendar list
- colletion of all calendar entried that a user has added. Shown in web UI in the left.
- can add or remove calendars from this list.
- insert -> add
- delete -> del secondary cal
- get -> get metadata
- patch/update -> modifies calendar metadata
- Reccuring meetings
- defined by two fields ([start, end] , [reccurence field])
- reccu field is an array of one or several RRULE, RDATE or EXDATE
- Read docs for more context
- Timezones can be also provided but this I can use the local timezone for now.
- Invite users
- Reminder and Notifications
