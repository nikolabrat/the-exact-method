# exact-dm: comment-to-DM bot for @theexactmethod

Cloudflare Worker. Comment a keyword (NARROW, PLAIN, VIDEO, METHOD, PROMPT) on a post → instant private-reply DM with the guide, then a public "check your DMs" reply.

- `src/rules.js`: keywords, guide links, pointer lines per Reel caption, PROMPT text. Edit and push to `bot` to change replies.
- `src/index.js`: webhook (instant) + 2-minute poll (backstop), Unified login (Facebook Login for Business, system-user token that never expires), KV log.
- Routes: `/` status, `/connect` (log in as @theexactmethod once), `/callback`, `/webhook`, `/log` (last 40 events, usernames masked).
- Secret `META_APP_SECRET` is set in the Cloudflare dashboard, never in git. `META_APP_ID` is in wrangler.jsonc.

## Connecting the account (either way works)
1. Dashboard token (the soulepreneur guide's way): Meta app → Use cases → Instagram API → API setup → Generate access tokens → Add account → Generate token. Paste it in Cloudflare as secret `IG_TOKEN`. The bot detects the host (graph.instagram.com or graph.facebook.com) and subscribes webhooks itself.
2. `/connect` login (Facebook Login for Business config).

Webhook signatures are checked against `META_APP_SECRET` and, if set, `IG_APP_SECRET` (Instagram app secret).
Phone: Instagram → Settings → Messages and story replies → Message controls → Connected tools → allow access to messages.
