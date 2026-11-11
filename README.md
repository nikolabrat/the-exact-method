# Product files hand-off

The cloud chat makes new versions of the product PDFs and puts them in `ready/`.
The local chat (the one linked to the laptop) does the switch when Nikola says "we're done for now":

1. Download every file in `ready/` from this branch.
2. In the folder "The Exact Method" on the laptop, delete the old version of each file and put the new one in its place (same file name as listed in `ready/MANIFEST.md`).
3. Upload the same file to the matching Gumroad product (Composio, account thriftwellstudio) and remove the old file from it, so the folder and Gumroad match.
4. Mark each line in `ready/MANIFEST.md` as switched, with the date, and push.

Gumroad note: when keeping an existing file in a product update, Gumroad only accepts the canonical URL
https://s3.amazonaws.com/gumroad/attachments/<user id>/<hash>/original/<name>.pdf (take <hash> from the signed files.gumroad.com URL that GET_PRODUCT returns).

| Product | Gumroad product id | Current file |
| --- | --- | --- |
| The Narrowing Method (Free Guide) | S5OmGHPgdouxIPLxPYv0fg== | 1-The-Narrowing-Method-Free-Guide.pdf |
| Plain Voice (Free Guide) | 2jVJsFb8UfMX_1Qb-ywVwQ== | 2-Plain-Voice-Free-Guide.pdf |
| The Video Brief | 3EeAgeKoA803rEPVr25Ang== | 3-The-Video-Brief-Free-Guide.pdf |
| 10 Zero-Ambiguity Prompts | nblbWh4y16vBspFinn95GQ== | 3-10-Zero-Ambiguity-Prompts.pdf |
| The Specialist Method | wCpn7k4bpOI2plrXtHalgQ== | 4-The-Specialist-Method.pdf |
| The Exact Method | GuzVk7IFFHaNE-EJ0n-2Vg== | 5-The-Exact-Method.pdf |
