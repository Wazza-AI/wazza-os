# Rules for agents in this repository

This repository is ONLY the Wazza OS user guide: a static site (HTML, CSS, JavaScript, fonts and pictures) that
GitHub Pages serves from the `main` branch, at its root.

- Never add source code, build tools, scripts, workflows, package files or configuration of Wazza OS here, and never
  secrets, keys, internal or test hosts, or personal data.
- The source of truth is `docs/manual/` in the private `wazza-os` repository. The pages here are its published copy:
  never edit them here (a change here is overwritten by the next publish).
- Update this repository only with `docs/manual/tools/publish-user-guide.sh` of the private repository. It checks the
  site, copies an allowlist of files, scans them for secrets, hosts, paths and e-mail addresses, and commits.
- The files that belong to this repository itself, and may be edited here: `README.md`, `LICENSE` (Apache-2.0,
  verbatim), `AGENTS.md`, `CLAUDE.md` and `.nojekyll`.

## When you are asked to update the user guide

1. In the private `wazza-os` repository, change the pages in `docs/manual/` (hand-written HTML; the regions between
   `<!-- …:BEGIN -->` and `<!-- …:END -->` markers are generated), then run `python3 docs/manual/tools/build_manual.py`
   and commit there (see `docs/manual/README.md`).
2. Run `docs/manual/tools/publish-user-guide.sh` (a dry run), then `docs/manual/tools/publish-user-guide.sh --push`.
3. Check the live site after GitHub Pages rebuilds it: <https://wazza-ai.github.io/wazza-os/>.

If you only have this repository, do not change the pages: say what should change, and where (the page and the
heading), so that it is changed in `docs/manual/` and published from there.
