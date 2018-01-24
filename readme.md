# vbb-change-positions

Crowd sourced database of station-specific platform positions for changes between [VBB](https://www.vbb.de) (Verkehrsverbund Berlin-Brandenburg) metro, suburban and regional lines.

You're invited to help, see the [data structure](#data-structure) and [contributing](#contributing) sections!

[![npm version](https://img.shields.io/npm/v/vbb-change-positions.svg)](https://www.npmjs.com/package/vbb-change-positions)
[![Build Status](https://travis-ci.org/juliuste/vbb-change-positions.svg?branch=master)](https://travis-ci.org/juliuste/vbb-change-positions)
[![Greenkeeper badge](https://badges.greenkeeper.io/juliuste/vbb-change-positions.svg)](https://greenkeeper.io/)
[![dependency status](https://img.shields.io/david/juliuste/vbb-change-positions.svg)](https://david-dm.org/juliuste/vbb-change-positions)
[![dev dependency status](https://img.shields.io/david/dev/juliuste/vbb-change-positions.svg)](https://david-dm.org/juliuste/vbb-change-positions#info=devDependencies)
[![License: ODbL](https://img.shields.io/badge/License-ODbL-brightgreen.svg)](license)
[![chat on gitter](https://badges.gitter.im/juliuste.svg)](https://gitter.im/juliuste)

## Installation and Usage

If you're using `JavaScript`, you can use the module by installing:

```shell
npm install vbb-change-positions
```

If you call the function exported by the module, it will return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/promise) that resolves with an array that looks like this:

```js
[
    {
        station: '900000024201',
        stationName: 'Bismarckstraße',
        fromLines: ['U7'],
        fromStation: '900000022202',
        fromStationName: 'Richard-Wagner-Platz',
        fromTrack: undefined,
        fromPosition: 0.2,
        toLines: ['U2'],
        toStation: '900000022101',
        toStationName: 'Sophie-Charlotte-Platz',
        toTrack: undefined,
        toPosition: 0.5,
        samePlatform: false
    }
    // …
]
```

## Data structure

The dataset is located in `data.ndjson`, a [ndjson](http://ndjson.org/) file which you can edit using a text editor or [vbb-change-positions-cli](https://github.com/juliuste/vbb-change-positions-cli).

Let's take the following example: I want to take the `S46` in the direction of `Königs Wusterhausen` to `Heidelberger Platz`, where I want to change to the `U3` towards `Krumme Lanke`.

![an illustration of the keys](illustration.svg)

The dataset row would then contain the following information:

| key name | description | required | example |
| -------- | ----------- | -------- | ------- |
| `station` | Interchange station ID\* | yes | `900000045102` |
| `stationName` | Interchange station name (only for readability of the dataset) | no | `Heidelberger Platz` |
| `fromLines`    | "Arriving" line names. Note that the lines must run on the same platform and share the same `fromStation`. For the lines that fit those criteria, there should exist only one dataset row grouping them, though. This key exists mostly because information on `fromTrack` is much harder to get/remember than the rather simple line names and sometimes the track changes but the platform doesn't. | yes | `["S42", "S46"]` |
| `fromStation` | *Previous* station ID\* on the line before changing | yes | `900000044101` |
| `fromStationName` | *Previous* station name on the line before changing (only for readability of the dataset) | no | `Hohenzollerndamm` |
| `fromTrack`| Arrival platform (track)\*\* | no | *empty*
| `fromPosition`| Number where to leave the arrival platform. Between `0` (at the rear end of the station) and `1` (at the front "driver's" end of the station) \*\*\* | yes | `1` |
| `toLines`    | "Departing" line names, see `fromLines` | yes | `["U3"]` |
| `toStation` | Next station (ID\*) on the line after changing | yes | `900000045101` |
| `toStationName` | Next station (name) on the line after changing (only for readability of the dataset) | no | `Rüdesheimer Platz` |
| `toTrack`| Departure platform (track)\*\* | no | *empty*
| `toPosition`| Number where to enter the departure platform.\*\*\* See also `fromPosition`. | yes | `1` |
| `samePlatform` | Set to `true` if both trains stop at the same platform (entire platform, not "only" track). `fromPosition` and `toPosition` will be ignored and **should be set to `0.5`** | no | `false` |

\* See [this document](station-ids.md) if you don't know how to find out some station's VBB station ID

\*\* If unknown, just leave empty/unset like I did here.

\*\*\* see [additional guidelines](#additional-guidelines)

Finally, our example would give us the following data row for the NDJSON file:

```json
{"station":"900000045102","stationName":"Heidelberger Platz","fromLines":["S42","S46"],"fromStation":"900000044101","fromStationName":"Hohenzollerndamm","fromPosition":1,"toLines":["U3"],"toStation":"900000045101","toStationName":"Rüdesheimer Platz","toPosition":1,"samePlatform":false}
```

### Additional guidelines

- If you're not too sure about the exact position on the platform, just take one of `0`, `0.5` or `1` that fits best, in order to prevent us from having data that seems really accurate but actually isn't.
- For interchange nodes with multiple names, station buildings and therefore multiple IDs, like `Messe Nord/ICC` and `Kaiserdamm`, use the ID for the **arrival** station. (*not strictly enforced yet, CLI doesn't support this atm*)
- If there are multiple ways connecting to platforms, either add separate rows for all of them or just add the shortest connection.
- `fromLines` and `toLines` must be different, `fromStation` and `toStation` can be identical, however.

## Contributing

Please note that this dataset **only contains data for metro, suburban and regional lines**; buses and trams are not included.

Have a look at [this list](completed.md) for a collection of stations that are covered already.

If you want to add information to the dataset, **[fork this repository](https://help.github.com/articles/fork-a-repo/), add information and finally [submit a pull request](https://help.github.com/articles/about-pull-requests/)**. If you don't know how any of this works, you can also just [open an issue](https://github.com/juliuste/vbb-change-positions/issues) with the information you want to add in text form and I'll add it to the dataset for you. The same applies if you have found an error or want to change anything about the data structure.

Please note that by contributing to this project, you waive any copyright claims on the information you add.

## License

This dataset is licensed under the [`ODbL` license (v1.0)](https://opendatacommons.org/licenses/odbl/1.0/).
