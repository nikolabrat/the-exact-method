# Skills

Run `bash setup.sh` from the repo root: it installs every skill listed below, the sound libraries and the plugins.

# Skills to reinstall in a new workspace (copy into ~/.claude/skills)

- content-principles: this branch, skills/content-principles
- instagram-agent (ig-*): git clone --depth 1 https://github.com/Jakeschincariol/instagram-agent-skill.git && cp -R instagram-agent-skill/skills/* ~/.claude/skills/
- no-slop-motion: git clone --depth 1 https://github.com/ferndesk/no-slop-motion.git && cp -R no-slop-motion/skills/no-slop-motion ~/.claude/skills/
- real-sfx + sound libraries: see skills/SOUND-SETUP.md
- Marketing Skills (Corey Haines, MIT, 53 skills): git clone --depth 1 https://github.com/coreyhaines31/marketingskills.git && cp -R marketingskills/skills/* ~/.claude/skills/
- remocn (MIT, Remotion component library; use for every Reel's animations): git clone --depth 1 https://github.com/Remocn/remocn.git && cp -R remocn/plugins/remocn/skills/remocn ~/.claude/skills/remocn && cp -R remocn/plugins/remocn/skills/add ~/.claude/skills/remocn-add && cp -R remocn/plugins/remocn/skills/video ~/.claude/skills/remocn-video ; then in remocn-add/SKILL.md set `name: remocn-add` and change ../video/ to ../remocn-video/, and in remocn-video/SKILL.md set `name: remocn-video`.
  Project setup (once per Remotion project): node ~/.claude/skills/remocn-video/scripts/setup.mjs <project>; add a tsconfig.json with "baseUrl": "." and "paths": {"@/*": ["src/*"]}; then `npx shadcn@latest add @remocn/<name> --yes` (lands in src/components/remocn/). Catalog: https://remocn.dev/llms-components.txt
