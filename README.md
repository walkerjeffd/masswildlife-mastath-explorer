MA Stream Temperature and Thermal Habitat Explorer
==================================================

Live Website https://walkerenvres.com/dev/masswildlife/

Prepared by: Jeffrey D Walker, PhD (<jeff@walkerenvres.com>, [Walker Environmental Research LLC](https://walkerenvres.com))  
For: [MA Division of Fisheries and Wildlife (MassWildlife)](https://www.mass.gov/orgs/division-of-fisheries-and-wildlife)

**Links**

Report and Output Datasets: [10.5281/zenodo.8145195](https://dx.doi.org/10.5281/zenodo.8145195)  
Model Source Code: [@walkerjeffd/masswildlife-mastath](https://github.com/walkerjeffd/masswildlife-mastath)  
Website Source Code: [@walkerjeffd/masswildlife-mastath-explorer](https://github.com/walkerjeffd/masswildlife-mastath-explorer) (this repo)

## Overview

This repo contains the source code of an interactive data visualization tool for exploring climate change impacts on stream temperature and thermal habitats across Massachusetts. This tool is part of the MA Stream Temperature and Thermal Habitat (MASTATH) project, for which the report is available here:

> Walker, J.D. (2023). A Regional Stream Temperature Model for Assessing Climate Change Impacts on Thermal Habitat in Massachusetts. Technical report prepared for Massachusetts Division of Fisheries and Wildlife (MassWildlife). July 13, 2023. DOI: [10.5281/zenodo.8145195](https://dx.doi.org/10.5281/zenodo.8145195)

This web application was developed using vue3, vuetify, highcharts, leaflet and vite.

## Data Files

The datasets for this web app are generated as part of the model code for the project, which is available here: [@walkerjeffd/masswildlife-mastath](https://github.com/walkerjeffd/masswildlife-mastath)

Two output files for the web app should be copied from the `./data/output/app` directory of the model repo, to the `./public/data` directory of this repo. These files include:

- `basins.geojson`: GeoJSON file of HUC8 basins
- `flowlines.geojson`: GeoJSON file of NHDPlusV2 flowlines with attributes containing projected stream temperatures under baseline and future climate scenarios

## Development

To run the app locally, clone this repo and run the following commands in the terminal:

### Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Deploy to Production server

```sh
npm run deploy
```

## License

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) (see `LICENSE`)
