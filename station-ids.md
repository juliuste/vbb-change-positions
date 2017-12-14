# Finding out a station's VBB ID

As you might know, every VBB station has its own unique station ID, and you'll need to know your station's ID in order to add it to the dataset.

Fortunately, for all the people that have `node.js` installed, [@derhuerst](https://github.com/derhuerst) wrote a command line tool just for that.

```shell
npm install -g vbb-stations-cli
```

Once you installed it, you should be able to search stations by running

```shell
vbb-stations --name "Bismarckstr"
```

which gives you a list of possible stations. **Please double check that you pick the right station, also check for errors by looking at the  lines running there.**

For a full documentation on this CLI tool, just run

```shell
vbb-stations --help
``
