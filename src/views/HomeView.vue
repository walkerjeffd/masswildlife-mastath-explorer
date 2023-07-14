<script setup lang="ts">
</script>

<template>
  <v-img
    class="bg-white splash"
    width="100%"
    :aspect-ratio="2.5"
    src="/img/jeffrey-hamilton-Z2S3-X64iOI-unsplash.jpg"
    cover
    alt="Photo of a stream in the woods"
  ></v-img>
  <div class="d-flex justify-center">
    <v-container style="position:absolute;top:100px">
      <v-row class="justify-center">
        <v-col cols="12" lg="12" xl="8">
          <v-sheet elevation="8" class="px-12 pt-16 pb-8 hero">
            <h1 class="text-h3 text-center mb-12 px-12">Welcome to the Massachusetts Stream Temperature and Thermal Habitat Explorer</h1>
            <v-container class="px-0 my-12">
              <v-row>
                <v-col cols="12" lg="6">
                  <v-img
                    width="100%"
                    src="/img/temperature-projection-map.jpg"
                    cover
                    class="elevation-2"
                    style="border-radius: 8px;"
                    alt="Map of Massachusetts with projected stream temperature changes"
                  ></v-img>
                </v-col>
                <v-col cols="12" lg="6" class="font-size-larger pl-8">
                  <div style="font-size:1.4rem" class="text-center">An interactive data visualization tool for exploring projected climate change impacts on stream temperature and thermal habitat across Massachusetts.</div>

                  <div class="text-center my-16 d-flex justify-space-around">
                    <v-btn :to="{name: 'explorer'}" color="primary" size="x-large" aria-label="Open Explorer">
                      Open Explorer <v-icon icon="mdi-arrow-right" class="ml-2"></v-icon>
                    </v-btn>
                  </div>
                  <div class="text-center mt-12">
                    <v-btn :to="{name: 'about'}" color="default" size="large" aria-label="Learn More">
                      <v-icon icon="mdi-book-open-outline" start></v-icon> Learn More
                    </v-btn>
                  </div>

                  <div class="mt-12 text-center">
                    Report and output dataset available at <a href="https://doi.org/10.5281/zenodo.8145195">DOI:10.5281/zenodo.8145195</a>
                  </div>
                </v-col>
              </v-row>
            </v-container>

            <div class="font-size-larger text-center my-4">
              For questions or more information, please contact Jeff Walker at <a href="mailto:jeff@walkerenvres.com">jeff@walkerenvres.com</a>
            </div>

            <v-divider class="my-4"></v-divider>

            <div class="mt-4 text-center">
              Project completed by <a href="https://walkerenvres.com">Walker Environmental Research LLC</a> for <a href="https://www.mass.gov/orgs/division-of-fisheries-and-wildlife">MA Division of Fisheries and Wildlife (MassWildlife)</a> with funding from the <a href="https://resilientma.mass.gov/shmcap-portal">2018 State Hazard Mitigation and Climate Adaptation Plan (SHMCAP)</a>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
