<template>
    <div>
        <div class="form-group row">
            <label for="txtFirstName" class="col-lg-3 col-xl-2 col-form-label">
                First Name <span v-if="$v.firstName.$error" class="error-asterisk">*</span>
            </label>
            <div class="col-lg-9 col-xl-10">
                <input type="text" class="form-control" name="txtFirstName" v-bind:class="{ 'invalid-field': $v.firstName.$error }" v-model="firstName">
            </div>
            <div class="offset-lg-3 offset-xl-2 col-lg-9 col-xl-10 field-error-message">
                <span v-if="$v.firstName.$error && !$v.firstName.required">First name is required.</span>
            </div>
        </div>
        <div class="form-group row">
            <label for="txtMiddleName" class="col-lg-3 col-xl-2 col-form-label">Middle Name</label>
            <div class="col-lg-9 col-xl-10">
                <input type="text" class="form-control" name="txtMiddleName" v-model="middleName">
            </div>
        </div>  
        <div class="form-group row">
            <label for="txtLastName" class="col-lg-3 col-xl-2 col-form-label">
                Last Name <span v-if="$v.lastName.$error" class="error-asterisk">*</span>
            </label>
            <div class="col-lg-9 col-xl-10">
                <input type="text" class="form-control" name="txtLastName" v-bind:class="{ 'invalid-field': $v.lastName.$error }" v-model="lastName">
            </div>
            <div class="offset-lg-3 offset-xl-2 col-lg-9 col-xl-10 field-error-message">
                <span v-if="$v.lastName.$error && !$v.lastName.required">Last name is required.</span>
            </div>
        </div>  
        <div class="form-group row">
            <label for="txtEmail" class="col-lg-3 col-xl-2 col-form-label">
                Email <span v-if="$v.email.$error" class="error-asterisk">*</span>
            </label>
            <div class="col-lg-9 col-xl-10">
                <input type="email" class="form-control" name="txtEmail" v-bind:class="{ 'invalid-field': $v.email.$error }" v-model="email">
            </div>
            <div class="offset-lg-4 offset-xl-2 col-lg-8 col-xl-10 field-error-message">
                <span v-if="$v.email.$error && !$v.email.required">Email is required.</span>
            </div>
        </div>
        <div class="form-group row">
            <div class="offset-lg-3 offset-xl-2  col-lg-9 col-xl-10">
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="chkUseEmailAsUserName" name="chkUseEmailAsUserName" v-model="useEmailAsUserName">
                    <label for="chkUseEmailAsUserName" class="form-check-label">
                        Use email address as username.
                    </label>
                </div>
            </div>
        </div>
        <div class="form-group row">
            <label for="txtUsername" class="col-lg-3 col-xl-2 col-form-label">
                Username <span v-if="$v.userName.$error" class="error-asterisk">*</span>
            </label>
            <div class="col-lg-9 col-xl-10">
                <div class="input-group">
                    <input type="text" class="form-control" name="txtUserName" v-bind:class="{ 'invalid-field': $v.userName.$error }" :readonly="useEmailAsUserName" v-model="userName">
                    <div class="input-group-append">
                        <span class="input-group-text">
                            <span v-if="!$v.userName.required"><i class="fas fa-cog"></i></span>
                            <span v-else-if="$v.$pending"><i class="fas fa-cog fa-spin"></i></span>
                            <span style="color: red;" v-else-if="!$v.userName.isUserNameAvailable"><i class="fas fa-times-circle"></i></span>
                            <span style="color: green;" v-else><i class="fas fa-check-circle"></i></span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="offset-lg-3 offset-xl-2 col-lg-9 col-xl-10" style="height:15px;">
                <span class="field-error-message" v-if="$v.userName.$error && !$v.userName.required">Username is required.</span>
                <span class="field-error-message" v-else-if="!$v.$pending && !$v.userName.isUserNameAvailable">Username is unavailable.</span>
                <span class="field-valid-message" v-else-if="!$v.$pending && $v.userName.required && $v.userName.isUserNameAvailable">Username is available.</span>
            </div>
        </div>
        <div class="form-group row">
            <label for="txtPassword" class="col-lg-3 col-xl-2 col-form-label">
                Password <span v-if="$v.password.$error" class="error-asterisk">*</span>
            </label>
            <div class="col-lg-9 col-xl-10">
                <input type="password" class="form-control" name="txtPassword" v-bind:class="{ 'invalid-field': $v.password.$error }" v-model="password">
            </div>
            <div class="offset-lg-3 offset-xl-2 col-lg-9 col-xl-10 field-error-message">
                <span v-if="$v.password.$error && !$v.password.required">Password is required.</span>
            </div>
        </div>
        <div class="form-group row">
            <label for="txtPasswordConf" class="col-lg-3 col-xl-2 col-form-label">
                Confirm Password  <span v-if="$v.passwordConf.$error" class="error-asterisk">*</span>
            </label>
            <div class="col-lg-9 col-xl-10">
                <input type="password" class="form-control" v-bind:class="{ 'invalid-field': $v.passwordConf.$error }" name="txtPasswordConf" v-model="passwordConf">
            </div>
            <div class="offset-lg-3 offset-xl-2 col-lg-9 col-xl-10 field-error-message">
                <span v-if="$v.passwordConf.$error && !$v.passwordConf.required">Password confirmation is required.</span>
                <span v-else-if="$v.passwordConf.$error && !$v.passwordConf.sameAsPassword">Confirmation password does not match new password.</span>
            </div>
        </div>
        <div class="form-group row">
            <div class="offset-lg-3 offset-xl-2 col-lg-9 col-xl-10">
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="chkIsAdmin" name="chkIsAdmin" v-model="isAdmin">
                    <label for="chkIsAdmin" class="form-check-label">
                        This user is an admin.
                    </label>
                </div>
            </div>
        </div>
        <div class="form-group row">
            <div class="col-12 text-center">
                <button type="button" @click="submitForm" class="btn btn-primary"><i class="fas fa-user-plus"></i> Create User</button>
            </div>
        </div>
    </div>
</template>

<script>

    import { required, email, sameAs } from 'vuelidate/lib/validators';
    import axios from "axios";

    export default {
        name: 'createUserApp',
        data () {
            return {
                loggedInUser: $cookies.get('DWWebsite_user'),
                firstName: '',
                middleName: '',
                lastName: '',
                email: '',
                isAdmin: false,
                useEmailAsUserName: true,
                userName: '',
                password: '',
                passwordConf: ''
            }
        },
        validations: {
            firstName: {
                required
            },
            lastName: {
                required
            },
            email: {
                required,
                email
            },
            userName: {
                required,
                async isUserNameAvailable(userName) {

                    //If this is blank, return true since required field will take care of it.
                    if (userName == '') {
                        return true;
                    }

                    try {
                        axios.defaults.headers.common['x-access-token'] = $cookies.get('DWWebsite_token');

                        //See if the username is available
                        let res = await axios
                        .post('/userapi/isusernameavaliable', {
                            userName: this.userName
                        });

                        return res.data.isUserNameAvaliable;

                    }
                    catch(err) {
                        console.log(err);
                    }
                }
            },
            password: {
                required
            },
            passwordConf: {
                required,
                sameAsPassword: sameAs('password')
            }
        },
        watch: {
            email: function (val) {
                if (this.useEmailAsUserName) {
                    this.userName = this.email;
                }
            },
            useEmailAsUserName: function (val) {
                if (this.useEmailAsUserName) {
                    this.userName = this.email;
                }
            }
        },
        methods: {                    
            submitForm: async function (event) {
                //Check validation
                this.$v.$touch();
                if (!this.$v.$anyError) {
                    try {
                        axios.defaults.headers.common['x-access-token'] = $cookies.get('DWWebsite_token');

                        //Create User
                        let res = await axios
                        .post('/userapi/users', {
                            firstName: this.firstName,
                            middleName: this.middleName,
                            lastName: this.lastName,
                            email: this.email,
                            userName: this.userName,
                            password: this.password,
                            isAdmin: this.isAdmin
                        });

                        this.resetForm();

                        //Fire an event containing the new user
                        this.$emit('user-created', res.data);

                    }
                    catch(err) {
                        console.log(err);
                    }
                }
            },
            resetForm: function() {

                //Reset the form
                this.firstName = '';
                this.middleName = '';
                this.lastName = '';
                this.email = '';
                this.isAdmin = false;
                this.useEmailAsUserName = true;
                this.userName = '';
                this.password = '';
                this.passwordConf = '';

                this.$v.$reset();

            }
        }
    };

</script>