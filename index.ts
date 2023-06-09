import fs from "fs/promises";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import express, {
  Express,
  Request,
  Response,
} from "express";
import dotenv from "dotenv";
import session from "express-session";

dotenv.config();

//  ------- EXPPRESS SERVER

const app: Express = express();
const port = process.env.PORT ?? 3000;
const REDIRECT_URL = "oAuthCallback";

// If modifying these scopes, delete token.json.
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
];

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

function getOAuthClient(): OAuth2Client {
  const redirectURL =
    `http://localhost:3000/${REDIRECT_URL}`.toString();

  const auth = new OAuth2Client({
    clientId,
    clientSecret,
    redirectUri: redirectURL,
  });
  return auth;
}

function generateAuthUrl(
  client: OAuth2Client,
  scope?: string[]
): string {
  // Take the default SCOPES if nothing passsed
  if (!scope) {
    scope = SCOPES;
  }

  const url = client.generateAuthUrl({
    access_type: "offline",

    scope, // Define what scopes you wantt to access here.
  });

  return url;
}

app.use(
  session({
    name: "sessionId",
    resave: false,
    secret: "SECRET", // TODO: Change this later
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

app.get("/health", (req: Request, res: Response) => {
  res.send("Server is up");
});

app.get("/login", async (req: Request, res: Response) => {
  const client = getOAuthClient();

  const urlToConsent = generateAuthUrl(client);

  res.send(`
        <h1>Authentication using google oAuth</h1>
        <a href=${urlToConsent}>Login</a>
    `);
});

app.get(
  `/${REDIRECT_URL}`,
  async (req: Request, res: Response) => {
    const client = getOAuthClient();
    const code = req.query.code as string; // Get the code from the callback
    (req.session as any).code = code;

    if (!code) {
      // Something went wrong.
      res.status(400).json({ message: "something bad" });
    }

    try {
      const { tokens } = await client.getToken(code);

      (req.session as any).tokens = tokens;

      res.send(`
            <h3>Login successful!!</h3>
            <a href="/details">Go to details page</a>
        `);
    } catch (e) {
      console.log("FAILS");
      res.send(` <h1>LOGIN FAILED</h1>`);
    }
  }
);

app.get(
  "/details",
  async function (req: Request, res: Response) {
    // Check local file for session or fetch new ones if not availale
    let prasedUserToken;
    try {
      const userTokenFile = await fs.readFile(
        "./user-token.json",
        "utf-8"
      );

      prasedUserToken = JSON.parse(userTokenFile) as {
        code: string;
        tokens: any;
      };
    } catch (e) {
      console.log("No file found");
      return res.redirect("/login");
    }

    let userTokens;

    let client = getOAuthClient();

    userTokens =
      (prasedUserToken && prasedUserToken.tokens) ??
      (req.session as any).tokens;

    client.setCredentials(userTokens);

    const calendar = google.calendar({
      version: "v3",
      auth: client,
    });

    const calendarResponse = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = calendarResponse.data.items;
    if (!events || events.length === 0) {
      console.log("No upcoming events found.");
      return;
    }

    console.log("Upcoming 10 events:");

    const deets = events.map((event, i) => {
      const start =
        event.start?.dateTime || event.start?.date;
      console.log(`${start} - ${event.summary}`);
      return `${start} - ${event.summary}`;
    });

    res.send(`<pre>${deets}</pre>`);
  }
);

app.listen(port, () => {
  console.log(
    `⚡️[server]: Server is running at http://localhost:${port}`
  );
});
