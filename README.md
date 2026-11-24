# exact-dm: comment-to-DM bot for @theexactmethod

Cloudflare Worker. Comment a keyword (NARROW, PLAIN, VIDEO, METHOD, PROMPT) on a post → instant private-reply DM with the guide, then a public "check your DMs" reply.

- `src/rules.js`: keywords, guide links, pointer lines per Reel caption, PROMPT text. Edit and push to `bot` to change replies.
- `src/index.js`: webhook (instant) + 2-minute poll (backstop), Unified login (Facebook Login for Business, system-user token that never expires), KV log.
- Routes: `/` status, `/connect` (log in as @theexactmethod once), `/callback`, `/webhook`, `/log` (last 40 events, usernames masked).
- Secret `META_APP_SECRET` is set in the Cloudflare dashboard, never in git. `META_APP_ID` is in wrangler.jsonc.
