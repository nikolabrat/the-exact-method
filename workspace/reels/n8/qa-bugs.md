# N-8 QA bug log · 24 Nov 13:45 (render v1, every 8th frame checked against the voice)

| # | Frame / word | Bug | Fix |
| --- | --- | --- | --- |
| 1 | 305-315 "One line" | The two-phone scene keeps drawing for 10 frames under the next scene (a leftover yellow Claude Pro sliver + a second phone) | scenes with no exit end on their last frame |
| 2 | 311-340 "One line:" | Empty grey question bubble for ~1 s before typing starts | bubble appears with its first letter |
| 3 | 456-560 "Based on the projects…" | Physics chips land rotated/upside down ("online products" sideways, unreadable); one flies off to the right; one spawns at the top edge | own drop: upright chips stack in a readable pile, slight tilt only |
| 4 | 568 "and not" | Phone un-blurs for a few frames during the implode, flashing the full answer | keep the blur to the end |
| 5 | 576 | The dot sits on top of the "old chats" card edge | dot gone before the card opens |
| 6 | 640 "So" | New headline types over the outgoing cards before the push-through finishes | headline in after the push |
| 7 | 656-672 "asked" | 1·2·3 flash runs before "three" is said | the 3 card lands on the word "three" |
| 8 | 672, 1272 | Caption is ink-on-ink over the dark 3 card (invisible) | caption turns paper-white over dark cards |
| 9 | 952-1056 "All three…" | Receipt sits in the top half, ~600 px of empty paper under it for 3.5 s | receipt larger and centred |
| 10 | 1016 "Price can't" | "a tie." sits inside the excerpt card labelled "real run" but is our conclusion, not ChatGPT's | "a tie." becomes our handwritten sticker outside the excerpt |
| 11 | 1360 "ChatGPT" | lens-zoom renders a black frame with smeared text (flash) | own push-in from 1.5x with blur, on paper |
| 12 | 1600-1630 "it picked Claude" | The 12:27 Claude Pro card overlaps the "ChatGPT Plus · $20" tile | card higher and smaller |
| 13 | 1840-1856 | CTA card 3 drops over the comment field while landing | cards land above the field (start position) |
| 14 | 0:22, 0:50-0:53 | "3 smaller questions." and "ChatGPT picked itself." wrapped to 2 lines and the 2nd line covered the section tag | captions never wrap; long chunks shrink to fit one line |
