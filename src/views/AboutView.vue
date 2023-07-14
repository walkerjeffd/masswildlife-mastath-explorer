<template>
  <v-img
    class="bg-white splash"
    width="100%"
    :aspect-ratio="2.5"
    src="/img/jeffrey-hamilton-Z2S3-X64iOI-unsplash.jpg"
    cover
  ></v-img>
  <div class="d-flex justify-center">
    <v-container style="position:absolute;top:100px" fluid>
      <v-row class="justify-center">
        <v-col cols="12" lg="12" xl="6">
          <v-sheet elevation="8" class="px-12 pt-16 pb-8 hero">
            <h1 class="text-h3">About the Project</h1>

            <v-divider class="mb-8"></v-divider>

            <div class="text-h5">A Regional Stream Temperature Model for Assessing Climate Change Impacts on Thermal Habitat in Massachusetts</div>

            <div class="text-subtitle-1">Prepared by Jeffrey D. Walker, PhD (<a href="https://walkerenvres.com">Walker Environmental Research LLC</a>) for <a href="https://www.mass.gov/orgs/division-of-fisheries-and-wildlife">MA Division of Fisheries and Wildlife (MassWildlife)</a></div>
            <div class="text-subtitle-1">July 13, 2023</div>

            <v-alert color="accent" class="my-8 text-body-1" prominent>
              <div class="d-flex align-content-center">
                <v-icon class="mr-2">mdi-book-outline</v-icon> Report and dataset available here: <a class="ml-1" href="https://doi.org/10.5281/zenodo.8145195">doi:10.5281/zenodo.8145195</a>
              </div>
              <div class="d-flex align-content-center mt-2">
                <v-icon class="mr-2">mdi-github</v-icon> Source code available here: <a class="ml-1" href="https://github.com/walkerjeffd/masswildlife-stath-model">github.com/walkerjeffd/masswildlife-stath-model</a>
              </div>
            </v-alert>

            <div class="text-h5">Background</div>
            <p class="font-size-larger">
              Climate change poses a significant risk to native fish populations in Massachusetts. Coldwater species such as brown trout (Salmo trutta), brook trout (Salvelinus fontinalis) and other salmonids are particularly vulnerable to these changes. Warming air temperatures will lead to warmer waters, which increases the thermal stress on these species at multiple life stages, especially spawning. In addition to rising air temperatures, climate change will also impact the hydrology of all rivers across the state through changes to the amount and frequency of precipitation leading to longer and more severe droughts as well as more extreme wet events both of which affect fish habitat availability. The survival of temperature-sensitive fish species depends on the availability of so-called climate refugia, which are generally characterized as stream reaches that are relatively resistant to changes in air temperature and precipitation. Identifying where these refugia are most likely to occur both now and in the future is critical to ensure that they can be preserved and protected.
            </p>

            <div class="text-h5 mt-8">Study Objectives</div>
            <p class="font-size-larger">
              The primary objective of this study was to generate projections of changes in stream temperature and thermal habitat (i.e., cold water fish habitat) due to climate change across the state of Massachusetts. To achieve this, statistical and machine learning models were developed for predicting stream temperatures based on air temperature and various landscape metrics (e.g., land use, elevation, drainage area). The model was then used in conjunction with climate change projections of air temperature increases to estimate the potentional changes in stream temperatures and thermal habitat across the state. The results of this study are made available through this web-based tool to inform conservation and management decisions related to the protection of coldwater fish habitat in Massachusetts.
            </p>

            <div class="text-h5 mt-8">Data Sources</div>
            <p class="font-size-larger">
              This project relied on the following primary data sources:
            </p>
            <ul class="ml-8 mt-4">
              <li><strong>Stream Temperature Data</strong>: various sources including <a href="http://db.ecosheds.org/">SHEDS</a>, <a href="https://waterdata.usgs.gov/nwis">USGS NWIS</a>, <a href="https://www.crwa.org/">Charles River Watershed Assoc.</a>, <a href="https://hoorwa.org/monitoring/">Hoosic River Watershed Assoc.</a>, <a href="https://www.ipswichriver.org/">Ipswich River Watershed Assoc.</a>, <a href="https://pie-lter.ecosystems.mbl.edu/content/data-overview">PIE-LTER</a>, <a href="https://harvardforest1.fas.harvard.edu/exist/apps/datasets/showData.html?id=HF070">Harvard Forest</a>, and <a href="https://data.neonscience.org/data-products/DP1.20053.001">NEON</a>.</li>
              <li><strong>Hydrography</strong>: <a href="https://nhdplus.com/NHDPlus/NHDPlusV2_home.php">National Hydrography Dataset (NHD) Plus Version 2</a> (Medium Resolution: 1:100k) and associated <a href="https://www.sciencebase.gov/catalog/item/5669a79ee4b08895842a1d47">spatial attributes</a> based on a <a href="https://www.sciencebase.gov/catalog/item/5b92790be4b0702d0e809fe5">modified routing network</a>.</li>
              <li><strong>Historical Weather</strong>: <a href="https://daymet.ornl.gov/">Daymet</a> and <a href="https://prism.oregonstate.edu/">PRISM</a></li>
              <li><strong>Climate Change Projections</strong>: <a href="https://resilientma-mapcenter-mass-eoeea.hub.arcgis.com/">Resilient MA Maps and Data Center</a></li>
              <li>
                <strong>Thermal Habitat Thresholds:</strong> <a href="https://doi.org/10.1080/02755947.2013.855280">Summer Thermal Thresholds of Fish Community Transitions in Connecticut Streams (Beauchene et al., 2014)</a>
                <ul class="ml-4">
                  <li><strong>Cold</strong>: &lt; 18.45 &deg;C</li>
                  <li><strong>Cool</strong>: 18.45 – 22.30 &deg;C</li>
                  <li><strong>Warm</strong>: &gt; 22.30 &deg;C</li>
                </ul>
              </li>
            </ul>

            <div class="text-h5 mt-8">Modeling Methodology</div>
            <p class="font-size-larger">
              A regional model was developed for predicting stream temperatures in all streams and rivers across the state, excluding the largest rivers such as the Connecticut and Merrimack. The model was comprised of two components: 1) a non-linear regression model representing the functional relationship between air and water temperatures at a single location, and 2) a machine learning model (boosted decision trees) for estimating the parameters of the air-water temperature model spatially based on landscape characteristics. Together, these models demonstrated strong performance in predicting weekly water temperatures with an RMSE of 1.3 degC and Nash Sutcliffe Efficiency (NSE) of 0.97 based on an independent subset of the observed data that was excluded from model development and training.
            </p>

            <div class="text-h5 mt-8">Results</div>
            <p class="font-size-larger mb-4">
              Under historical baseline conditions (average air temperatures over 1971-2000), the model results showed more abundant cold water habitat in the western part of the state compared to the eastern and coastal areas. Forest and tree canopy cover were among the most important predictors of the relationship between air and water temperatures. The amount of impounded water due to dams upstream of each reach was also important. The majority of cold water habitat (82% of all river miles) were found in first order streams (i.e., headwaters), which are also the most abundant accounting for 60% of all river miles overall. The Deerfield and Hudson-Hoosic drainage basins had the most cold water habitat, which accounted for 80% or more of the total river miles within each basin. Coastal basins such as Narragansett, Piscataqua-Salmon Falls, Charles River, and Cape Code each had less than 5% cold water habitat.
            </p>
            <p class="font-size-larger">
              Using a series of projected air temperature increases for the RCP 8.5 emissions scenario, the model predicted a reduction in cold water habitat (mean July temp &lt; 18.45 &deg;C) from 30% to 8.5% (a 72% reduction) statewide by the 2090 averaging period (2080-2100). Furthermore, projections for larger streams (orders 3–5) were projected to shift from predominately cool-water (18.45–22.30 &deg;C) to the majority (> 50%) of river miles being classified as warm-water habitat (&gt; 22.30 &deg;C).
            </p>

            <div class="text-h5 mt-8">Conclusions</div>
            <p class="font-size-larger mb-4">
              The projected stream temperatures and thermal classifications generated by this project will be a valuable dataset for researchers and resource managers to assess potential climate change impacts on thermal habitats across the state. With this spatially continuous dataset, researchers and managers can identify specific reaches or basins projected to be the most resilient to climate change, and prioritize them for protection or restoration. As more datasets become available, this model can be readily extended and adapted to increase its spatial extent and resolution, and to incorporate flow data for assessing the impacts of not only rising air temperatures but also changing precipitation patterns.
            </p>

            <div class="text-h5 mt-8">Acknowledgements</div>
            <p class="font-size-larger mb-4">
              I would like to thank Jenn Fair (USGS) for her technical review of the model report and assistance in data gathering at the beginning of the project. I would also like to thank Ben Letcher (USGS) for his feedback and long-term collaboration on EcoSHEDS, which led to this project; Matt Fuller (USDA FS), Jenny Rogers (UMass Amherst), Valerie Ouellet (NOAA NMFS), and Aimee Fullerton (NOAA NMFS) for taking the time to discuss their experience, insights, and ideas regarding regional stream temperature modeling; Lisa Kumpf (CRWA) and Ryan O’Donnell (IRWA) for sharing their data directly; and Sean McCanty (NRWA), Julia Blatt (Mass Rivers Alliance), and Sarah Bower (Mass Rivers Alliance) for their assistance in sending out a request to the Mass Rivers Alliance for stream temperature data. Lastly, I am grateful for the countless individuals who collected the temperature data and without whom this project would not have been possible.
            </p>

            <div class="text-h5 mt-8">Funding</div>
            <p class="font-size-larger mb-4">
              This study was performed by Jeffrey D Walker, PhD of <a href="https://walkerenvres.com">Walker Environmental Research LLC</a> under contract to <a href="https://www.mass.gov/orgs/division-of-fisheries-and-wildlife">MA Division of Fisheries and Wildlife (MassWildlife)</a>. Funding was provided by the <a href="https://resilientma.mass.gov/shmcap-portal">2018 State Hazard Mitigation and Climate Adaptation Plan (SHMCAP)</a> for Massachusetts.
            </p>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
