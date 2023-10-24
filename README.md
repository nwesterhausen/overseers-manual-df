# Overseer's Reference Manual for Dwarf Fortress

[![release badge](https://img.shields.io/github/v/release/nwesterhausen/overseers-manual-df?style=plastic)](https://github.com/nwesterhausen/overseers-manual-df/releases/latest)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-conventionalcommits-e10079?logo=semantic-release&style=plastic)](https://github.com/semantic-release/semantic-release)
![last commit](https://img.shields.io/github/last-commit/nwesterhausen/overseers-manual-df?style=plastic)
[![supports df 50.xx](https://img.shields.io/badge/Supports%20Dwarf%20Fortress-0.50.xx-%235E3E0D?style=plastic)](https://bay12games.com/dwarves/)
[![on DF File Depot](https://img.shields.io/badge/DFFD-0.23.3-blue?style=plastic)](https://dffd.bay12games.com/file.php?id=15966)

This is a app which provides a searchable interface for your Dwarf Fortress raw files. It's built using
[Tauri](https://tauri.studio), [SolidJS](https://www.solidjs.com/), [TailwindCSS](https://tailwindcss.com/),
[daisyUI](https://daisyui.com/), and some [Rust](https://www.rust-lang.org/) code which parses the raws themselves
(using [dfraw_json_parser](https://github.com/nwesterhausen/dfraw_json_parser)).

<img align="left" src="https://github.com/nwesterhausen/overseers-manual-df/blob/main/src-tauri/icons/128x128.png?raw=true">

Currently it will display (and let you search through):

- Most creature information
- Some plant information
- Basic inorganic material information

![app-screenshot](docs/img/app_inuse.png)

![app-screenshot](docs/img/app_parsing.png)

## Usage

When the app is started for the first time, it presents some instructions:

![first-launch](docs/img/app_launched.png)

After a game directory is set and deemed valid by the app, it will parse and present data from the raws for searching
through.

## Supported Data

Includes some data about creatures, inorganic materials and plants.
