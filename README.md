# Depth Anything Jetson

This repository is both an [Obsidian](https://obsidian.md/) vault and a
[Quartz 5](https://quartz.jzhao.xyz/) site for the Live Any-View 3D
Reconstruction on Jetson Orin Nano project.

## Write in Obsidian

Open the `content` directory—not the repository root—as an Obsidian vault.
Notes, attachments, and folders inside `content` are published by default.
Set `draft: true` in a note's frontmatter when it should not be published.

The site homepage is `content/index.md`.

## Install

Quartz requires Node.js 22 or newer and npm 10.9.2 or newer.

For a fresh clone:

```shell
npm ci
npx quartz plugin install
```

If `quartz.lock.json` does not exist yet or the plugin list in
`quartz.config.yaml` has changed, synchronize it with:

```shell
npx quartz plugin install --from-config
```

## Preview and build

Start the local preview server:

```shell
npx quartz build --serve
```

Then open <http://localhost:8080>.

Create the production site in `public`:

```shell
npx quartz build
```

Generated files in `public` are ignored by Git.

## Update Quartz

Commit or stash local work first, then pull framework updates from the
configured official `upstream` remote:

```shell
npx quartz upgrade
npm ci
npx quartz plugin install
npx quartz build
```

Review upgrade conflicts before committing them.

## Deploy with Cloudflare Pages

Before deployment, replace the placeholder `configuration.baseUrl` in
`quartz.config.yaml` with the exact hostname Cloudflare assigns, without
`https://` or a trailing slash.

Use these Cloudflare Pages settings:

| Setting                | Value                                                                    |
| ---------------------- | ------------------------------------------------------------------------ |
| Production branch      | `main`                                                                   |
| Framework preset       | `None`                                                                   |
| Build command          | `git fetch --unshallow && npx quartz plugin install && npx quartz build` |
| Build output directory | `public`                                                                 |
| Node version           | `24`                                                                     |

Cloudflare configuration and deployment are intentionally managed outside this
repository.
