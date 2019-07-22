
# Demo ToughBucket
This web app allows the user to view a set of objects and their properties
on a web map.  The user can change the properties of the objects and add more objects.

## Inputs

Objects are initially populated from a csv file.
'data/toughdata.csv'.

## Current Features

* Get any location on the map simply double click.
* Multiple map types for user selections
* Display data from a csv data files
* Change objects active status or icon system
* Add additional objects
* Objects on map are movable

## Future Features

* Live display of radius of coverage when bucket is active.
* Live status of buckets
* Ability to run on an isolated system.
* Red Team / Blue Team as seperate layers that can be turned on and off.
* Save out current configuration to file


## WebApp

The webapp is located on gh_pages branch of this repo.
You can get to it from here.
[Demo Website](https://DiDacTexGit.github.io/demo_toughbucket)


### Viewing the app without nodejs

One can run the app locally (without the write to server) by simply typing

`python -m SimpleHTTPServer`
`python3 -m http.server`

in the command line where the index.html file is located


## Author
 - Evelyn Boettcher, ctr
 - DiDacTex, LLC
 - 2019, July
