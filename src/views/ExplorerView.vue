<script setup lang="ts">
// @ts-nocheck
import L from 'leaflet'
import type { Ref } from 'vue'
import { ref, computed, watch } from 'vue'
import { schemeSpectral } from 'd3-scale-chromatic'
import { scaleThreshold } from 'd3-scale'
import {
  LMap,
  LControlLayers,
  LControlScale,
  LTileLayer,
  LGeoJson
} from '@vue-leaflet/vue-leaflet'

import basemaps from '@/lib/basemaps'

const loading = ref(true)
const center: L.PointTuple = [42.2, -71.8]
const zoom = 9

const param: Ref<'TEMP' | 'THERMAL'> = ref('TEMP')
const year: Ref<'BASE' | '2030' | '2050' | '2070' | '2090'> = ref('BASE')
const delta = ref(false)
const prob: Ref<'Q10' | 'Q50' | 'Q90'> = ref('Q50')
const field = computed(() => {
  return year.value === 'BASE' ? year.value : `${year.value}_${prob.value}`
})

watch([field, delta, param], () => {
  if (year.value === 'BASE' || param.value === 'THERMAL') {
    delta.value = false
  }
  drawFlowlines()
})

// const deltaColorScale = scaleQuantize()
//   .domain([0, 4.5])
//   .range(schemeSpectral[9].toReversed())
const deltaColorScale = scaleThreshold()
  .domain([1, 1.5, 2, 2.5, 3, 3.5, 4])
  .range(schemeSpectral[8].toReversed())
window.deltaColorScale = deltaColorScale
const tempColorScale = scaleThreshold()
  .domain([16, 18, 20, 22, 24, 26, 28])
  .range(schemeSpectral[8].toReversed())

const thermalColorScale = scaleThreshold()
  .domain([18.45, 22.3])
  .range(['#2C7BB6', '#ABD9E9', '#FDAE61'])

const thermalClass: String<'Cold' | 'Cool' | 'Warm'> = function (value) {
  if (value < 18.45) {
    return 'Cold'
  } else if (value < 22.3) {
    return 'Cool'
  } else {
    return 'Warm'
  }
}

function getFlowlineColor (feature) {
  let tempValue = feature.properties[field.value]
  let color = '#CCC'
  let colorScale = tempColorScale
  if (param.value == 'TEMP' && delta.value) {
    tempValue = tempValue - feature.properties.BASE
    colorScale = deltaColorScale
  } else if (param.value == 'THERMAL') {
    colorScale = thermalColorScale
  }
  if (tempValue) {
    color = colorScale(tempValue)
  }
  return color
}

function restyleLayer (layer: L.Layer) {
  layer.setStyle({
    fillOpacity: 1,
    weight: 2,
    color: getFlowlineColor(layer.feature)
  })
}

function flowlinePopupTable (feature) {
  if (!feature?.properties?.BASE) return `
<div class="text-body-1">Flowline COMID: ${feature.id}</div>
<div class="text-body-2">GNIS Name: ${feature.properties.GNIS_NAME || 'N/A'}</div>
<div class="text-body-2 mt-4">Predictions not available for this reach</div>
`
  return `
<div class="text-body-1">Flowline COMID: ${feature.id}</div>
<div class="text-body-2">GNIS Name: ${feature.properties.GNIS_NAME || 'N/A'}</div>
<div class="v-table v-theme--theme mt-4">
  <div class="v-table__wrapper">
    <table class="table-predictions">
      <thead>
        <tr>
          <th></th>
          <th>Mean July<br/>Temp (&deg;C)</th>
          <th>Change from<br/>Baseline (&deg;C)</th>
          <th>Thermal<br/>Class</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Baseline</td>
          <td style="text-align:end">${feature.properties.BASE.toFixed(1)}</td>
          <td>--</td>
          <td>
            <span class="thermal-${thermalClass(feature.properties.BASE).toLowerCase()}">${thermalClass(feature.properties.BASE)}</span>
          </td>
        </tr>
        <tr>
          <td>2030</td>
          <td>
            ${feature.properties['2030_Q50'].toFixed(1)}
            <br/>
            (${feature.properties['2030_Q10'].toFixed(1)} - ${feature.properties['2030_Q90'].toFixed(1)})
          </td>
          <td>
            ${(feature.properties['2030_Q50']-feature.properties['BASE']).toFixed(1)}
            <br/>
            (${(feature.properties['2030_Q10']-feature.properties['BASE']).toFixed(1)} -
            ${(feature.properties['2030_Q90']-feature.properties['BASE']).toFixed(1)})
          </td>
          <td>
            <span class="thermal-${thermalClass(feature.properties['2030_Q50']).toLowerCase()}">
              ${thermalClass(feature.properties['2030_Q50'])}
            </span>
            <br/>
            (${thermalClass(feature.properties['2030_Q10'])} - ${thermalClass(feature.properties['2030_Q90'])})
          </td>
        </tr>
        <tr>
          <td>2050</td>
          <td>
            ${feature.properties['2050_Q50'].toFixed(1)}
            <br/>
            (${feature.properties['2050_Q10'].toFixed(1)} - ${feature.properties['2050_Q90'].toFixed(1)})
          </td>
          <td>
            ${(feature.properties['2050_Q50']-feature.properties['BASE']).toFixed(1)}
            <br/>
            (${(feature.properties['2050_Q10']-feature.properties['BASE']).toFixed(1)} -
            ${(feature.properties['2050_Q90']-feature.properties['BASE']).toFixed(1)})
          </td>
          <td>
            <span class="thermal-${thermalClass(feature.properties['2050_Q50']).toLowerCase()}">
              ${thermalClass(feature.properties['2050_Q50'])}
            </span>
            <br/>
            (${thermalClass(feature.properties['2050_Q10'])} - ${thermalClass(feature.properties['2050_Q90'])})
          </td>
        </tr>
        <tr>
          <td>2070</td>
          <td>
            ${feature.properties['2070_Q50'].toFixed(1)}
            <br/>
            (${feature.properties['2070_Q10'].toFixed(1)} - ${feature.properties['2070_Q90'].toFixed(1)})
          </td>
          <td>
            ${(feature.properties['2070_Q50']-feature.properties['BASE']).toFixed(1)}
            <br/>
            (${(feature.properties['2070_Q10']-feature.properties['BASE']).toFixed(1)} -
            ${(feature.properties['2070_Q90']-feature.properties['BASE']).toFixed(1)})
          </td>
          <td>
            <span class="thermal-${thermalClass(feature.properties['2070_Q50']).toLowerCase()}">
              ${thermalClass(feature.properties['2070_Q50'])}
            </span>
            <br/>
            (${thermalClass(feature.properties['2070_Q10'])} - ${thermalClass(feature.properties['2070_Q90'])})
          </td>
        </tr>
        <tr>
          <td>2090</td>
          <td>
            ${feature.properties['2090_Q50'].toFixed(1)}
            <br/>
            (${feature.properties['2090_Q10'].toFixed(1)} - ${feature.properties['2090_Q90'].toFixed(1)})
          </td>
          <td>
            ${(feature.properties['2090_Q50']-feature.properties['BASE']).toFixed(1)}
            <br/>
            (${(feature.properties['2090_Q10']-feature.properties['BASE']).toFixed(1)} -
            ${(feature.properties['2090_Q90']-feature.properties['BASE']).toFixed(1)})
          </td>
          <td>
            <span class="thermal-${thermalClass(feature.properties['2090_Q50']).toLowerCase()}">
              ${thermalClass(feature.properties['2090_Q50'])}
            </span>
            <br/>
            (${thermalClass(feature.properties['2090_Q10'])} - ${thermalClass(feature.properties['2090_Q90'])})
          </td>
        </tr>
      </tbody>
    </table>
    <div class="text-caption">Median projections with (10th - 90th) percentile range in parentheses.</div>
  </div>
</div>
  `
}

const basins = {
  data: null,
  options: {
    id: 'basins',
    url: 'data/basins.geojson',
    title: 'Major Basins (HUC8)',
    visible: true,
    interactive: true,
    style: () => {
      return {
        className: 'basin',
        fillOpacity: 0,
        color: 'gray',
        weight: 1
      }
    },
    onEachFeature: function (feature: { properties: { basin: string, huc8: string } }, layer: L.Layer) {
      layer.bindTooltip(`<div class="text-body-1">${feature.properties.basin}</div><div class="text-caption">HUC8: ${feature.properties.huc8}</div>`, { sticky: true })
      layer.on({
        mouseover: () => {
          layer.setStyle({
            weight: 2,
            color: 'black'
          })
        },
        mouseout: () => {
          layer.setStyle({
            fillOpacity: 0,
            weight: 1,
            color: 'gray'
          })
        }
      })
    }
  }
}

const flowlines = {
  data: null,
  options: {
    id: 'flowlines',
    url: 'data/flowlines.geojson',
    title: 'Flowlines',
    visible: true,
    interactive: true,
    top: true,
    style: (layer: L.Layer) => {
      return {
        fillOpacity: 1,
        color: getFlowlineColor(layer),
        weight: 2
      }
    },
    onEachFeature: function (feature, layer: L.Layer) {
      layer.bindTooltip(`${flowlinePopupTable(feature)}`, { sticky: true })
      layer.on({
        mouseover: () => {
          layer.setStyle({
            weight: 4
          })
        },
        mouseout: () => {
          restyleLayer(layer)
        }
      })
    }
  },
  mapLayer: null
}

function drawFlowlines () {
  flowlines.mapLayer.eachLayer((L: L.Layer) => {
    restyleLayer(L)
  })
}

async function createLayer (layer) {
  const url = layer.options.url
  const response = await fetch(url)
  const geojson = await response.json()
  return new L.GeoJSON(geojson, layer.options)
}

async function mapReady (map: L.Map) {
  loading.value = true

  const basinsLayer = await createLayer(basins)
  const flowlinesLayer = await createLayer(flowlines)
  flowlines.mapLayer = flowlinesLayer
  map.addLayer(basinsLayer)
  map.addLayer(flowlinesLayer)

  loading.value = false
}

</script>

<template>
  <div class="explorer">
    <div class="explorer-sidebar elevation-4" style="z-index:500">
      <v-card style="width:100%">
        <v-card-text>
          <div class="d-flex mb-2 mt-4">
            <div class="text-h6">Time Horizon</div>
            <v-spacer></v-spacer>
            <div class="text-right">
              <v-tooltip dir="right">
                <template v-slot:activator="{ props }">
                  <v-btn icon="$info" variant="flat" size="x-small" v-bind="props"></v-btn>
                </template>
                <span v-html="'Baseline = 1971-2000 (30-yr Normal)<br/>Climate Projection Periods:<br/>&nbsp;&nbsp;&nbsp;&nbsp;2030 = 2015 - 2045<br/>&nbsp;&nbsp;&nbsp;&nbsp;2050 = 2035 - 2065<br/>&nbsp;&nbsp;&nbsp;&nbsp;2070 = 2055 - 2085<br/>&nbsp;&nbsp;&nbsp;&nbsp;2090 = 2080 - 2100'"></span>
              </v-tooltip>
            </div>
          </div>
          <div class="d-flex">
            <v-btn-toggle v-model="year" mandatory divided class="flex-grow-1">
              <v-btn variant="outlined" class="flex-grow-1" value="BASE">Baseline</v-btn>
              <v-btn variant="outlined" class="flex-grow-1" value="2030">2030</v-btn>
              <v-btn variant="outlined" class="flex-grow-1" value="2050">2050</v-btn>
              <v-btn variant="outlined" class="flex-grow-1" value="2070">2070</v-btn>
              <v-btn variant="outlined" class="flex-grow-1" value="2090">2090</v-btn>
            </v-btn-toggle>
          </div>

          <div class="d-flex mt-8 mb-2">
            <div class="text-h6">Projection Probability</div>
            <v-spacer></v-spacer>
            <div class="text-right">
              <v-tooltip dir="right">
                <template v-slot:activator="{ props }">
                  <v-btn icon="$info" variant="flat" size="x-small" v-bind="props"></v-btn>
                </template>
                <span v-html="'Show median or lower/upper bounds<br>based on air temperature projections<br>from stochastic weather generator<br><br>Note: Disabled when viewing Baseline'"></span>
              </v-tooltip>
            </div>
          </div>
          <div class="d-flex">
            <v-btn-toggle v-model="prob" mandatory divided class="flex-grow-1" :disabled="year === 'BASE'">
              <v-btn variant="outlined" class="flex-grow-1" value="Q10">10th Percentile</v-btn>
              <v-btn variant="outlined" class="flex-grow-1" value="Q50">Median</v-btn>
              <v-btn variant="outlined" class="flex-grow-1" value="Q90">90th Percentile</v-btn>
            </v-btn-toggle>
          </div>

          <div class="text-h6 mb-2 mt-8">Parameter</div>
          <div class="d-flex">
            <v-btn-toggle v-model="param" mandatory divided class="flex-grow-1">
              <v-btn variant="outlined" class="flex-grow-1" value="TEMP">Temperature</v-btn>
              <v-btn variant="outlined" class="flex-grow-1" value="THERMAL">Thermal Class</v-btn>
            </v-btn-toggle>
          </div>

          <v-checkbox
            v-model="delta"
            label="Show Temperature Increase Relative to Baseline"
            :disabled="year == 'BASE' || param == 'THERMAL'"
          ></v-checkbox>

          <div class="my-8"></div>

          <div v-if="param == 'TEMP' && !delta">
            <svg width="400" height="60" viewBox="0,0,400,60" style="overflow: visible; display: block;">
              <g>
                <rect x="0" y="18" width="49" height="16" fill="#3288bd"></rect>
                <rect x="50" y="18" width="49" height="16" fill="#66c2a5"></rect>
                <rect x="100" y="18" width="49" height="16" fill="#abdda4"></rect>
                <rect x="150" y="18" width="49" height="16" fill="#e6f598"></rect>
                <rect x="200" y="18" width="49" height="16" fill="#fee08b"></rect>
                <rect x="250" y="18" width="49" height="16" fill="#fdae61"></rect>
                <rect x="300" y="18" width="49" height="16" fill="#f46d43"></rect>
                <rect x="350" y="18" width="49" height="16" fill="#d53e4f"></rect>
              </g>
              <g transform="translate(0,34)" fill="none" font-size="12" font-family="sans-serif" text-anchor="middle">
                <g class="tick" opacity="1" transform="translate(25,0)">
                  <line stroke="currentColor" y2="5"></line>
                  <text fill="currentColor" y="10" dy="0.71em">&lt; 16</text>
                </g>
                <g class="tick" opacity="1" transform="translate(75,0)">
                  <line stroke="currentColor" y2="5"></line>
                  <text fill="currentColor" y="10" dy="0.71em">16-18</text>
                </g>
                <g class="tick" opacity="1" transform="translate(125,0)">
                  <line stroke="currentColor" y2="5"></line>
                  <text fill="currentColor" y="10" dy="0.71em">18-20</text>
                </g>
                <g class="tick" opacity="1" transform="translate(175,0)">
                  <line stroke="currentColor" y2="5"></line>
                  <text fill="currentColor" y="10" dy="0.71em">20-22</text>
                </g>
                <g class="tick" opacity="1" transform="translate(225,0)">
                  <line stroke="currentColor" y2="5"></line>
                  <text fill="currentColor" y="10" dy="0.71em">22-24</text>
                </g>
                <g class="tick" opacity="1" transform="translate(275,0)">
                  <line stroke="currentColor" y2="5"></line>
                  <text fill="currentColor" y="10" dy="0.71em">24-26</text>
                </g>
                <g class="tick" opacity="1" transform="translate(325,0)">
                  <line stroke="currentColor" y2="5"></line>
                  <text fill="currentColor" y="10" dy="0.71em">26-28</text>
                </g>
                <g class="tick" opacity="1" transform="translate(375,0)">
                  <line stroke="currentColor" y2="5"></line>
                  <text fill="currentColor" y="10" dy="0.71em">&ge; 28</text>
                </g>
                <text x="0" y="-30" fill="currentColor" text-anchor="start" font-weight="bold" class="title" font-size="14">
                  Mean July Water Temperature (&deg;C)
                </text>
              </g>
            </svg>
          </div>
          <div v-if="param == 'TEMP' && delta">
            <svg width="400" height="60" viewBox="0,0,400,60" style="overflow: visible; display: block;">
              <g>
                <rect x="0" y="18" width="49" height="16" fill="#3288bd"></rect>
                <rect x="50" y="18" width="49" height="16" fill="#66c2a5"></rect>
                <rect x="100" y="18" width="49" height="16" fill="#abdda4"></rect>
                <rect x="150" y="18" width="49" height="16" fill="#e6f598"></rect>
                <rect x="200" y="18" width="49" height="16" fill="#fee08b"></rect>
                <rect x="250" y="18" width="49" height="16" fill="#fdae61"></rect>
                <rect x="300" y="18" width="49" height="16" fill="#f46d43"></rect>
                <rect x="350" y="18" width="49" height="16" fill="#d53e4f"></rect>
              </g>
              <g transform="translate(0,34)" fill="none" font-size="12" font-family="sans-serif" text-anchor="middle">
                <g class="tick" opacity="1" transform="translate(25,0)">
                  <line stroke="currentColor" y2="5"></line>
                  <text fill="currentColor" y="10" dy="0.71em">&lt; 1</text>
                </g>
                <g class="tick" opacity="1" transform="translate(75,0)">
                  <line stroke="currentColor" y2="5"></line>
                  <text fill="currentColor" y="10" dy="0.71em">1-1.5</text>
                </g>
                <g class="tick" opacity="1" transform="translate(125,0)">
                  <line stroke="currentColor" y2="5"></line>
                  <text fill="currentColor" y="10" dy="0.71em">1.5-2</text>
                </g>
                <g class="tick" opacity="1" transform="translate(175,0)">
                  <line stroke="currentColor" y2="5"></line>
                  <text fill="currentColor" y="10" dy="0.71em">2-2.5</text>
                </g>
                <g class="tick" opacity="1" transform="translate(225,0)">
                  <line stroke="currentColor" y2="5"></line>
                  <text fill="currentColor" y="10" dy="0.71em">2.5-3</text>
                </g>
                <g class="tick" opacity="1" transform="translate(275,0)">
                  <line stroke="currentColor" y2="5"></line>
                  <text fill="currentColor" y="10" dy="0.71em">3-3.5</text>
                </g>
                <g class="tick" opacity="1" transform="translate(325,0)">
                  <line stroke="currentColor" y2="5"></line>
                  <text fill="currentColor" y="10" dy="0.71em">3.5-4</text>
                </g>
                <g class="tick" opacity="1" transform="translate(375,0)">
                  <line stroke="currentColor" y2="5"></line>
                  <text fill="currentColor" y="10" dy="0.71em">&ge; 4</text>
                </g>
                <text x="0" y="-30" fill="currentColor" text-anchor="start" font-weight="bold" class="title" font-size="14">
                  Increase in Mean July Water Temperature (&deg;C)
                </text>
              </g>
            </svg>
          </div>
          <div v-else-if="param == 'THERMAL'">
            <svg width="400" height="60" viewBox="0,0,400,60" style="overflow: visible; display: block;">
              <g>
                <rect x="1" y="18" width="132" height="16" fill="#2C7BB6"></rect>
                <rect x="134" y="18" width="132" height="16" fill="#ABD9E9"></rect>
                <rect x="267" y="18" width="132" height="16" fill="#FDAE61"></rect>
              </g>
              <g transform="translate(0,34)" fill="none" font-size="12" font-family="sans-serif" text-anchor="middle">
                <g class="tick" opacity="1" transform="translate(68,0)">
                  <line stroke="currentColor" y2="5"></line>
                  <text fill="currentColor" y="10" dy="0.71em">&lt; 18.45 &deg;C</text>
                  <text fill="currentColor" y="26" dy="0.71em">Cold</text>
                </g>
                <g class="tick" opacity="1" transform="translate(201,0)">
                  <line stroke="currentColor" y2="5"></line>
                  <text fill="currentColor" y="10" dy="0.71em">18.45 - 22.30 &deg;C</text>
                  <text fill="currentColor" y="26" dy="0.71em">Cool</text>
                </g>
                <g class="tick" opacity="1" transform="translate(334,0)">
                  <line stroke="currentColor" y2="5"></line>
                  <text fill="currentColor" y="10" dy="0.71em">&gt; 22.30 &deg;C</text>
                  <text fill="currentColor" y="26" dy="0.71em">Warm</text>
                </g>
                <text x="0" y="-30" fill="currentColor" text-anchor="start" font-weight="bold" class="title" font-size="14">
                  Thermal Classes
                </text>
              </g>
            </svg>
            <div class="mt-8 text-grey-darken-1">
              Thresholds from "Summer Thermal Thresholds of Fish Community Transitions in Connecticut Streams" (<a href="https://doi.org/10.1080/02755947.2013.855280">Beauchene et al., 2014</a>)
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
    <div class="explorer-map">
      <div style="height:100%;width:100%">
        <LMap :zoom="zoom" :center="center" :options="{ preferCanvas: true }" @ready="mapReady">
          <LControlLayers position="topleft"></LControlLayers>
          <LControlScale position="bottomleft"></LControlScale>
          <LTileLayer
            v-for="tile in basemaps"
            :key="tile.name"
            :name="tile.name"
            :visible="tile.visible"
            :url="tile.url"
            :attribution="tile.attribution"
            :options="tile.options"
            layer-type="base"
          ></LTileLayer>
          <LGeoJson
            v-if="basins.data"
            name="basins"
            :options="basins.options"
            :options-style="basins.style as L.StyleFunction"
          ></LGeoJson>
          <LGeoJson
            v-if="flowlines.data"
            name="flowlines"
            :options="flowlines.options"
            :options-style="flowlines.style as L.StyleFunction"
          ></LGeoJson>
        </LMap>
        <v-sheet class="explorer-loading elevation-2 px-4 py-2 ma-2" color="primary" rounded v-if="loading">
          <v-progress-circular
            color="white"
            indeterminate
            size="24"
          ></v-progress-circular>
          <span class="ml-4">Loading...</span>
        </v-sheet>
      </div>
    </div>
  </div>
</template>

<style>
.explorer {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}
.explorer-map {
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  position: relative;
}
.explorer-sidebar {
  display: flex;
  flex-basis: 420px;
  flex-grow: 0;
  flex-shrink: 1;
}
.explorer-station {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 30%;
  min-width: 400px;
  z-index:500;
}
.explorer-loading {
  position: absolute;
  top: 0;
  right: 0;
  z-index:1000;
}

.table-predictions-container {
  width: 300px;;
  overflow-x: auto;
}

.table-predictions {
  display: block !important;
  margin-bottom: 10px;
}

.table-predictions th {
  text-align: center !important;
}

.table-predictions td {
  text-align: center !important;
}

.table-predictions span.thermal-cold {
  padding: 2px;
  background-color: #2C7BB6 !important;
  color: white;
}

.table-predictions span.thermal-cool {
  padding: 2px;
  background-color: #ABD9E9 !important;
}

.table-predictions span.thermal-warm {
  padding: 2px;
  background-color: #FDAE61 !important;
}

</style>