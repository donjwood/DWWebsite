<template>
    <div class="card mx-auto">
        <h5 class="card-header">Sense Hat Data <i v-if="isRefreshing" class="fas fa-circle-notch fa-spin"></i></h5>
        <div class="card-body">
            <div class="card-text">
                <div class="row" v-if="isLoading">
                    <div class="col-12 large-wait-spinner">
                        <i class="fas fa-circle-notch fa-spin"></i>
                        Fetching Sense Hat Data
                    </div>
                </div>
                <div class="row" v-if="!isLoading && !serverRequestError">
                    <div class="col-12">
                        CPU Temp: {{ celsiusToFahrenheit(senseHatData.cpuTemp).toFixed(1) }} F<br/>
                        Temperature: {{ celsiusToFahrenheit(senseHatData.temperature).toFixed(1) }} F<br/>
                        Pressure: {{ mbarToInHg(senseHatData.pressure).toFixed(2) }} inHg <br/>
                        Temp from Pressure Sensor: {{ celsiusToFahrenheit(senseHatData.temperatureFromPressure).toFixed(1) }} F<br/>
                        Humidity: {{ senseHatData.humidity.toFixed(1) }}%<br/>
                        Pitch: {{ senseHatData.pitch.toFixed(1) }}<br/>
                        Roll: {{ senseHatData.roll.toFixed(1) }}<br/>
                        Yaw: {{ senseHatData.yaw.toFixed(1) }}<br/><br/>
                        Last Updated at {{ lastUpdatedDate.toLocaleDateString() + " " + lastUpdatedDate.toLocaleTimeString()}}
                    </div>
                </div>
                <div class="row" v-if="serverRequestError">
                    <div class="col-12">
                        <b-alert variant="danger" show>
                            <i class="fas fa-exclamation-triangle"></i> {{ serverRequestError }}
                        </b-alert>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    export default {
        name: 'senseHatApp',
        data() {
            return {
                senseHatData: {
                    cpuTemp: 0,
                    temperature: 0,
                    pressure: 0,
                    temperatureFromPressure: 0,
                    humidity: 0,
                    pitch: 0,
                    roll: 0,
                    yaw: 0
                },
                lastUpdatedDate: new Date(),
                isLoading: false,
                isRefreshing: false,
                refreshInterval: 30000,
                serverRequestError: ''
            }
        },
        created: async function () {

            this.isLoading = true;
            axios.defaults.headers.common['x-access-token'] = $cookies.get('DWWebsite_token');

            try {

                let res = await axios
                .get('/sensehatapi/getsensehatdata');

                this.senseHatData = res.data;
                this.lastUpdatedDate = new Date();
                this.isLoading = false;

                //Set up auto refresh
                setInterval(this.refreshSenseHatData, this.refreshInterval);

            } catch(err) {
                this.serverRequestError = err;
                console.log(err);
                this.isLoading = false;
            }
        },
        methods: {
            refreshSenseHatData: async function () {

                this.isRefreshing = true;
                axios.defaults.headers.common['x-access-token'] = $cookies.get('DWWebsite_token');

                try {

                    let res = await axios
                    .get('/sensehatapi/getsensehatdata');

                    this.senseHatData = res.data;
                    this.lastUpdatedDate = new Date();
                    this.isRefreshing = false;

                } catch(err) {
                    this.serverRequestError = err;
                    console.log(err);
                    this.isRefreshing = false;
                }

            },
            celsiusToFahrenheit: function (celsiusTemp) {
                return (celsiusTemp * 9/5) + 32;
            },
            mbarToInHg: function (mbarPressure) {
                return mbarPressure / 33.864;
            }
        }
    }
</script>