# vbb-change-positions

Crowd sources database of station-specific platform positions for changes between [VBB](https://www.vbb.de) (Verkehrsverbund Berlin-Brandenburg) metro, suburban and regional lines.

You're invited to help, see the [data structure](#data-structure) and [contributing](#contributing) sections!

[![npm version](https://img.shields.io/npm/v/vbb-change-positions.svg)](https://www.npmjs.com/package/vbb-change-positions)
[![Build Status](https://travis-ci.org/juliuste/vbb-change-positions.svg?branch=master)](https://travis-ci.org/juliuste/vbb-change-positions)
[![Greenkeeper badge](https://badges.greenkeeper.io/juliuste/vbb-change-positions.svg)](https://greenkeeper.io/)
[![dependency status](https://img.shields.io/david/juliuste/vbb-change-positions.svg)](https://david-dm.org/juliuste/vbb-change-positions)
[![dev dependency status](https://img.shields.io/david/dev/juliuste/vbb-change-positions.svg)](https://david-dm.org/juliuste/vbb-change-positions#info=devDependencies)
[![License: ODbL](https://img.shields.io/badge/License-ODbL-brightgreen.svg)](https://opendatacommons.org/licenses/odbl/)
[![chat on gitter](https://badges.gitter.im/juliuste.svg)](https://gitter.im/juliuste)

## Installation and Usage

If you're using `JavaScript`, you can use the module by installing:

```shell
npm install vbb-change-positions
```

If you call the function exported by the module, it will return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/promise) that resolves in an array of data rows like this:

```js
[
    {
        "station": "900000024201",
        "stationName": "Bismarckstraße",
        "fromLine": "U7",
        "fromStation": "900000022202",
        "fromStationName": "Richard-Wagner-Platz",
        "fromTrack": null,
        "fromPosition": 0.2,
        "toLine": "U2",
        "toStation": "900000022101",
        "toStationName": "Sophie-Charlotte-Platz",
        "toTrack": null,
        "toPosition": 0.5,
        "samePlatform": false
    }
    // …
]
```

## Data structure

The dataset is located in `data.csv`, a [CSV](https://frictionlessdata.io/guides/csv/) file you can edit using a text editor or spreadsheets like `Microsoft Excel` or [`Libreoffice Calc`](https://www.libreoffice.org/discover/calc/).

Let's take the following example: I want to take the `U7` in the direction of `Rudow` to `Bismarckstraße`, where I want to change to the `U2` towards `Ruhleben`.

The dataset row would then contain the following information:

| key name | description | required | example |
| -------- | ----------- | -------- | ------- |
| `station` | Interchange station ID\* | yes | `900000024201` |
| `stationName` | Interchange station name (only for readability of the dataset) | no | `Bismarckstaße` |
| `fromLine`    | Line before changing | yes | `U7` |
| `fromStation` | Last station (ID\*) on the line before the interchange station | yes | `900000022202` |
| `fromStationName` | Last station (name) on the line before the interchange station (only for readability of the dataset) | no | `Richard-Wagner-Platz` |
| `fromTrack`| Arrival platform | no | `""`\*\*
| `fromPosition`| Number beween 0 (back) and 1 (front, driver pisition), e.g. 0.5 for middle\*\*\* where you leave the arrival platform | yes | `0.2` |
| `toLine`    | Line after changing | yes | `U2` |
| `toStation` | First station (ID\*) on the line after the interchange station | yes | `900000022101` |
| `toStationName` | First station (name) on the line after the interchange station (only for readability of the dataset) | no | `Sophie-Charlotte-Platz` |
| `toTrack`| Departure platform | no | `""`\*\*
| `toPosition`| Number beween 0 (back) and 1 (front, driver pisition), e.g. 0.5 for middle\*\*\* where you enter the departure platform | yes | `0.5` |
| `samePlatform` | Set to `true` if both connections meet at the same platform (entire platform, not "only" track). `fromPosition` and `toPosition` will be ignored and **should be set to `0.5`** | no | `false` |

\* See [this document](station-ids.md) if you don't know how to find out some station's VBB station ID

\*\* If unknown, just leave empty like I did here.

\*\*\* see [additional guidelines](#additional-guidelines)

Finally, our example would give us the following data row for the CSV file:

`900000024201,Bismarckstraße,U7,900000022202,Richard-Wagner-Platz,,0.2,U2,900000022101,Sophie-Charlotte-Platz,,0.5,false`

### Additional guidelines

- If you're not too sure about the exact position on the platform, just take one of `0`, `0.5` or `1` that fits best, in order to prevent us from having data that seems really accurate but actually isn't.
- For interchange nodes with multiple names, station buildings and therefore multiple IDs, like `Messe Nord/ICC` and `Kaiserdamm`, use the ID for the **arrival** station.
- If there's multiple ways connecting to platforms, either add separate rows for all of them or just add the shortest connection
- `fromLine` and `toLine` must be different, `fromStation` and `toStation` can be identical, however

## Contributing

**Please note that this dataset only contains data for metro, suburban and regional lines; buses and trams are not included.**

If you want to add information to the dataset, do so by forking this repository, adding the information you want to add and finally submitting a pull request. If you don't know how any of this works, you can also just open an issue [here](https://github.com/juliuste/vbb-change-positions/issues) with the information you want to add in text form and I'll add it to the dataset for you. Same goes for if you find an error or want to change anything about the data structure.

Please note that by contributing to this project, you pass on any copyright of the information you add. (This should be obvious, I'm mentioning it for legal reasons nonetheless.)

Have a look at [this list](completed.md) for a collection of stations that have already been "completed". If you send a pull requests that completes another station, feel free to add it there.

## License

This dataset is licensed under the [`ODbL` license (v1.0)](https://opendatacommons.org/licenses/odbl/1.0/).
