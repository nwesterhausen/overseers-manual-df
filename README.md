# Overseer's Reference Manual for Dwarf Fortress

[![release badge](https://img.shields.io/github/v/release/nwesterhausen/overseers-manual-df?style=plastic)](https://github.com/nwesterhausen/overseers-manual-df/releases/latest)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-conventionalcommits-e10079?logo=semantic-release&style=plastic)](https://github.com/semantic-release/semantic-release)
![last commit](https://img.shields.io/github/last-commit/nwesterhausen/overseers-manual-df?style=plastic)
[![supports df 50.04](https://img.shields.io/badge/Supports%20Dwarf%20Fortress-0.50.04-%235E3E0D?style=plastic)](https://bay12games.com/dwarves/)
[![on DF File Depot](https://img.shields.io/badge/DFFD-0.20.2-blue?style=plastic)](https://dffd.bay12games.com/file.php?id=15966)

![app icon](src-tauri/icons/128x128.png)

This is a app which provides a searchable interface for the your Dwarf Fortress raw files. It's built using
[Tauri](https://tauri.studio), [SolidJS](https://www.solidjs.com/),
[Solid-Boostrap](https://solid-libs.github.io/solid-bootstrap), and some [Rust](https://www.rust-lang.org/) code which
parses the raws themselves (using [dfraw_json_parser](https://github.com/nwesterhausen/dfraw_json_parser)).

![app-screenshot](docs/img/app_inuse.png)

## Usage

The app saves some data in `...AppData\Roaming\games.nwest.dwarffortress.overseer-manual` (or the equivalent on Linux or
MacOS) in a file `settings.json`:

| Key            | Description                                                 |
| -------------- | ----------------------------------------------------------- |
| `lastSaveUsed` | The most recently used save file                            |
| `dfSavesPath`  | Path to your Dwarf Fortress save directory (from last time) |

When the app is started for the first time, it presents some instructions:

![first-launch](docs/img/app_launched.png)

After a game directory is set and deemed valid by the app, it will parse and present data from the raws for searching
through.

## Supported Data

### Bestiary

The bestiary search includes all creatures defined in raws. It cannot include generated creatures because they are not
exposed in a readable format (since 50.xx release, raws are not stored with saves, and save data is in a special
format).
