<script setup lang="ts">
// @ts-nocheck
import type L from 'leaflet'
import type { Ref } from 'vue'
import { ref, computed, watch } from 'vue'
import { schemeSpectral } from 'd3-scale-chromatic'
import { scaleQuantize, scaleThreshold } from 'd3-scale'
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
  return `${year.value}_${prob.value}`
})

watch([field, delta, param], () => {
  if (year.value === 'BASE' || param.value === 'THERMAL') {
    delta.value = false
  }
  drawFlowlines()
})

const deltaColorScale = scaleQuantize()
  .domain([0, 5])
  .range(schemeSpectral[6].toReversed())

const tempColorScale = scaleThreshold()
  .domain([16, 18, 20, 22, 24, 26, 28])
  .range(schemeSpectral[8].toReversed())

const thermalColorScale = scaleThreshold()
  .domain([18.45, 22.3])
  .range(['#2C7BB6', '#ABD9E9', '#FDAE61'])

function restyleLayer (layer: L.Layer) {
  let tempValue = layer.feature.properties[field.value]
  let colorScale = tempColorScale
  if (param.value == 'TEMP' && delta.value) {
    tempValue = tempValue - layer.feature.properties[`BASE_${prob.value}`]
    colorScale = deltaColorScale
  }
  if (param.value == 'THERMAL') {
    colorScale = thermalColorScale
  }
  layer.setStyle({
    fillOpacity: 1,
    weight: 2,
    color: colorScale(tempValue)
  })
}

const basins = {
  style: () => {
    return {
      className: 'basin',
      fillOpacity: 0,
      color: 'gray',
      weight: 1
    }
  },
  options: {
    id: 'basins',
    url: 'data/basins.geojson',
    title: 'Major Basins (HUC8)',
    visible: true,
    interactive: true,
    onEachFeature: function (feature: { properties: { basin: string, huc8: string } }, layer: L.Layer) {
      layer.bindTooltip(`${feature.properties.basin} (${feature.properties.huc8})`, { sticky: true })
      layer.on({
        mouseover: () => {
          layer.setStyle({
            fillOpacity: 0.2,
            weight: 2,
            color: 'black',
            fillColor: 'gray'
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
  style: (layer: L.Layer) => {
    const value = layer.properties[field.value]
    return {
      fillOpacity: 1,
      color: tempColorScale(value),
      weight: 2
    }
  },
  options: {
    id: 'flowlines',
    url: 'data/flowlines.geojson',
    title: 'Flowlines',
    visible: true,
    interactive: false
    // onEachFeature: function (feature, layer: L.Layer) {
    //   layer.bindTooltip(`${feature.properties.COMID}`, { sticky: true })
    // }
  },
  mapLayer: null
}

function drawFlowlines () {
  flowlines.mapLayer.eachLayer((L: L.Layer) => {
    restyleLayer(L)
  })
}

async function fetchLayer (layer: L.GeoJSON) {
  // @ts-ignore
  const url = layer.options.url
  const response = await fetch(url)
  const geojson = await response.json()
  layer.addData(geojson)
}
// layer.getLayers()[0].setStyle
async function mapReady (map: L.Map) {
  loading.value = true
  // await sleep(1000)
  // console.log(basins.options.url)
  // map.on('overlayadd', overlayAdd)
  // map.on('overlayremove', overlayRemove)
  map.eachLayer(async (d) => {
    // @ts-ignore
    if (d.options?.visible) {
      // @ts-ignore
      await fetchLayer(d)
      if (d.options.id === "flowlines") {
        flowlines.mapLayer = d
      }
    }
  })
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
                <span v-html="'Baseline = 1971-2000<br/>30-Yr Averaging Periods:<br/>&nbsp;&nbsp;2030 = 2015 - 2045<br/>&nbsp;&nbsp;2050 = 2035 - 2065<br/>&nbsp;&nbsp;2070 = 2055 - 2085<br/>&nbsp;&nbsp;2090 = 2080 - 2100'"></span>
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
                <span v-html="'Median and lower/upper bounds of<br>air temperature projections based<br>on stochastic weather generator'"></span>
              </v-tooltip>
            </div>
          </div>
          <div class="d-flex">
            <v-btn-toggle v-model="prob" mandatory divided class="flex-grow-1">
              <v-btn variant="outlined" class="flex-grow-1" value="Q10">10th Percentile</v-btn>
              <v-btn variant="outlined" class="flex-grow-1" value="Q50">Median</v-btn>
              <v-btn variant="outlined" class="flex-grow-1" value="Q90">90th Percentile</v-btn>
            </v-btn-toggle>
          </div>

          <!-- <v-divider class="my-8"></v-divider> -->

          <div class="text-h6 mb-2 mt-8">Parameter</div>
          <div class="d-flex">
            <v-btn-toggle v-model="param" mandatory divided class="flex-grow-1">
              <v-btn variant="outlined" class="flex-grow-1" value="TEMP">Temperature</v-btn>
              <v-btn variant="outlined" class="flex-grow-1" value="THERMAL">Thermal Class</v-btn>
            </v-btn-toggle>
          </div>

          <!-- <v-checkbox
            v-model="delta"
            label="Show Change Relative to Baseline"
            :disabled="year == 'BASE' || param == 'THERMAL'"
          ></v-checkbox> -->

          <div class="my-12"></div>

          <div v-if="param == 'TEMP' && !delta">
            <svg width="400" height="50" viewBox="0,0,400,50" style="overflow: visible; display: block;">
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
            name="basins"
            :options="basins.options"
            :options-style="basins.style as L.StyleFunction"
          ></LGeoJson>
          <LGeoJson
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

<style scoped>
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
</style>