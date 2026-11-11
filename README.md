# Product files hand-off

The cloud chat makes new versions of the product PDFs and puts them in `ready/`.
The local chat (the one linked to the laptop) does the switch when Nikola says "we're done for now":

1. Download every file in `ready/` from this branch.
2. In the folder "The Exact Method" on the laptop, delete the old version of each file and put the new one in its place (same file name as listed in `ready/MANIFEST.md`).
3. Upload the same file to the matching Gumroad product (Composio, account thriftwellstudio) and remove the old file from it, so the folder and Gumroad match.
4. Mark each line in `ready/MANIFEST.md` as switched, with the date, and push.

Gumroad note: when keeping an existing file in a product update, Gumroad only accepts the canonical URL
https://s3.amazonaws.com/gumroad/attachments/<user id>/<hash>/original/<name>.pdf (take <hash> from the signed files.gumroad.com URL that GET_PRODUCT returns).

| Product | Gumroad product id | File name in the laptop folder | File name on Gumroad (11 Nov) |
| --- | --- | --- | --- |
| The Narrowing Method (Free Guide) | S5OmGHPgdouxIPLxPYv0fg== | 1-The-Narrowing-Method-Free-Guide.pdf | 1-The-Narrowing-Method-Free-Guide |
| Plain Voice (Free Guide) | 2jVJsFb8UfMX_1Qb-ywVwQ== | 2-Plain-Voice-Free-Guide.pdf | 2-Plain-Voice-Free-Guide |
| The Video Brief | 3EeAgeKoA803rEPVr25Ang== | 3-The-Video-Brief-Free-Guide.pdf | 3-The-Video-Brief-Free-Guide |
| 10 Zero-Ambiguity Prompts | nblbWh4y16vBspFinn95GQ== | 4-10-Zero-Ambiguity-Prompts.pdf | 3-10-Zero-Ambiguity-Prompts |
| The Specialist Method | wCpn7k4bpOI2plrXtHalgQ== | 5-The-Specialist-Method.pdf | 4-The-Specialist-Method |
| The Exact Method | GuzVk7IFFHaNE-EJ0n-2Vg== | 6-The-Exact-Method.pdf | 5-The-Exact-Method |

The folder name is the one to replace. On Gumroad, the last three files still carry the old numbers (3-, 4-, 5-), as GET_PRODUCT returned them on 11 Nov; when a new version is uploaded, give it the folder name so both match from then on.
