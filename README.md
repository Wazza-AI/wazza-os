# Wazza OS user guide

**[Download Wazza OS](https://os.wazza.ai/download)** for Linux. During the beta, the download page asks for the access
code you received.

Read the guide: **<https://wazza-ai.github.io/wazza-os/>**

Wazza OS is AI that works with you, in the tools you already use. It runs a computer of its own (a virtual machine)
next to yours, with real desktop apps in it, and AI agents that work in those apps beside you: you ask, they work,
you watch, step in, or carry on in your own tab.

- **Real apps, safely apart.** GIMP, Blender, ONLYOFFICE, a browser, VSCodium and dozens more run in virtual machines,
  not on your computer.
- **Several agents at once.** Each app opens in a tab with its own Chat; agents work in parallel tabs while you keep
  yours.
- **Skills and personas.** Agents load know-how for each app and task, and learn your way of working.
- **Drive.** Agents see the app's screen and use the mouse and keyboard, in any app.
- **Any AI.** A plan you already pay for, an API key from one of 73 providers, a company gateway, or a model on your
  own computer.

Website: <https://os.wazza.ai>

## Install

Paste this in a terminal, on the Linux computer where Wazza OS will live. It asks for your password once, for `sudo`.

```sh
curl -fsSL https://os.wazza.ai/install.sh | sh
```

To test first, without installing anything:

```sh
curl -fsSL https://os.wazza.ai/install.sh | sh -s -- --check
```

- **Finds your package type.** Debian, Ubuntu and their family get the `.deb`. Fedora and openSUSE get the `.rpm`. Arch
  and its family get the Arch package. Any other distribution gets the tarball.
- **Verifies the release.** Nothing installs unless the release manifest carries Wazza's Ed25519 signature and the
  package matches its signed SHA-256 and size.
- **Resumes if cut.** The package is large. If the download stops, run the command again: it continues where it
  stopped.

What your computer needs, other ways to install, updates and removal: [Install, update, remove](https://wazza-ai.github.io/wazza-os/install.html).

## Connect your AI agent

Claude Code, Codex, Cursor, VS Code, Gemini CLI, Hermes and Prime Agent can work in Wazza OS through `wazza-os mcp`, the
MCP server that comes with it. For Claude Code, once:

```sh
claude mcp add --scope user wazza-os -- wazza-os mcp
```

The line for each agent: [The Wazza OS MCP](https://wazza-ai.github.io/wazza-os/mcp.html#connect-an-agent-from-outside). Everything an agent can do:
[Every Wazza OS MCP tool](https://wazza-ai.github.io/wazza-os/mcp-tools.html).

## Control Wazza OS

- **From a terminal**, on your desktop or on a server: [The command line](https://wazza-ai.github.io/wazza-os/cli.html) and
  [Wazza OS on a server](https://wazza-ai.github.io/wazza-os/cli-server.html).
- **From an agent**: [The Wazza OS MCP](https://wazza-ai.github.io/wazza-os/mcp.html) and [Every Wazza OS MCP tool](https://wazza-ai.github.io/wazza-os/mcp-tools.html).

## Contents

- **Start here**
  - [Wazza OS: download, install, connect](https://wazza-ai.github.io/wazza-os/index.html)
  - [Quick start](https://wazza-ai.github.io/wazza-os/quick-start.html)
  - [Install, update, remove](https://wazza-ai.github.io/wazza-os/install.html)
  - [The first start](https://wazza-ai.github.io/wazza-os/first-start.html)
  - [Getting around](https://wazza-ai.github.io/wazza-os/window.html)
- **Work with agents**
  - [Chats, agents and models](https://wazza-ai.github.io/wazza-os/chats.html)
  - [Several agents at once](https://wazza-ai.github.io/wazza-os/parallel-tabs.html)
  - [Sign in, plans and API keys](https://wazza-ai.github.io/wazza-os/signin.html)
  - [Drive: agents on screen](https://wazza-ai.github.io/wazza-os/drive.html)
  - [Computer Control](https://wazza-ai.github.io/wazza-os/computer-control.html)
  - [Skills, learning and personas](https://wazza-ai.github.io/wazza-os/skills.html)
- **Apps and files**
  - [Apps and tabs](https://wazza-ai.github.io/wazza-os/apps.html)
  - [Desktop apps and the GPU](https://wazza-ai.github.io/wazza-os/gpu-apps.html)
  - [Add your own apps](https://wazza-ai.github.io/wazza-os/custom-apps.html)
  - [Files and sharing](https://wazza-ai.github.io/wazza-os/files.html)
- **Connect and automate**
  - [The Wazza OS MCP](https://wazza-ai.github.io/wazza-os/mcp.html)
  - [Every MCP tool](https://wazza-ai.github.io/wazza-os/mcp-tools.html)
  - [The command line](https://wazza-ai.github.io/wazza-os/cli.html)
  - [On a server (virtual screen)](https://wazza-ai.github.io/wazza-os/cli-server.html)
- **Settings**
  - [General](https://wazza-ai.github.io/wazza-os/settings-general.html)
  - [Virtual machines](https://wazza-ai.github.io/wazza-os/settings-vms.html)
  - [VM resources](https://wazza-ai.github.io/wazza-os/settings-resources.html)
  - [Chats & agents](https://wazza-ai.github.io/wazza-os/settings-chats.html)
  - [Skills & learning](https://wazza-ai.github.io/wazza-os/settings-skills.html)
  - [Files & sharing](https://wazza-ai.github.io/wazza-os/settings-files.html)
  - [Sync & team](https://wazza-ai.github.io/wazza-os/settings-sync.html)
  - [This computer](https://wazza-ai.github.io/wazza-os/settings-computer.html)
  - [The Update page](https://wazza-ai.github.io/wazza-os/update.html)
- **How it behaves**
  - [Privacy and security](https://wazza-ai.github.io/wazza-os/privacy-security.html)
  - [Memory, CPU and disk](https://wazza-ai.github.io/wazza-os/memory-cpu.html)
- **Help**
  - [Troubleshooting](https://wazza-ai.github.io/wazza-os/troubleshooting.html)
  - [Glossary](https://wazza-ai.github.io/wazza-os/glossary.html)

## About this repository

This repository is the published Wazza OS user guide, a static site served by GitHub Pages. It holds no source code
of Wazza OS. Its pages are generated from the guide's source and published as they are: please send corrections
through the Feedback page of Wazza OS (Home › Feedback) rather than as changes here.

## License

The user guide (its text and pictures) is licensed under the [Apache License 2.0](LICENSE). The Geist font in
`assets/fonts/` is licensed under the SIL Open Font License 1.1 (see `assets/fonts/README.md`).
