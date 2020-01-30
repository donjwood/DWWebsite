import Vue from 'vue';
import Vuelidate from 'vuelidate';
import BootstrapVue from 'bootstrap-vue';
import VueCookies from 'vue-cookies';
import Login from './components/Login.vue';
import ChangePassword from './components/ChangePassword.vue';
import EditUser from './components/EditUser.vue';
import CreateUser from './components/CreateUser.vue';
import ManageUsers from './components/ManageUsers.vue';
import SenseHatData from './components/SenseHatData.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(Vuelidate);
Vue.use(BootstrapVue);
Vue.use(VueCookies);

new Vue({
    el: '#app',
    components: {
        Login: Login,
        ChangePassword: ChangePassword,
        EditUser: EditUser,
        CreateUser: CreateUser,
        ManageUsers: ManageUsers,
        SenseHatData: SenseHatData
    }
});