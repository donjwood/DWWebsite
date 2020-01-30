<template>
    <div>
        <div v-show="successfullyChangedPassword && showSuccessMessage" class="row">
            <div class="col-12">
                <b-alert show variant="success">
                    <i class="fas fa-check"></i> Successfully changed password.
                </b-alert>
            </div>
        </div>
        <div v-show="errorMessage" class="row">
            <div class="col-12">
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-triangle"></i> {{ errorMessage }}
                </div>
            </div>
        </div>
        <div v-show="!successfullyChangedPassword || !showSuccessMessage">
            <div v-show="requireCurrentPassword" class="form-group row">
                <label for="txtCurrentPassword" class="col-md-6 col-form-label">
                    Current Password <span v-if="$v.currentPassword.$error" class="error-asterisk">*</span>
                </label>
                <div class="col-md-6">
                    <input type="password" class="form-control" v-bind:class="{ 'invalid-field': $v.currentPassword.$error }" name="txtCurrentPassword" v-model.lazy="currentPassword">
                </div>
                <div class="offset-md-6 col-md-6 field-error-message">
                    <span v-if="$v.currentPassword.$error && !$v.currentPassword.currentPasswordRequired">Current password is required.</span>
                </div>
            </div>
            <div class="form-group row">
                <label for="txtNewPassword" class="col-md-6 col-form-label">
                    New Password <span v-if="$v.newPassword.$error" class="error-asterisk">*</span>
                </label>
                <div class="col-md-6">
                    <input type="password" class="form-control" v-bind:class="{ 'invalid-field': $v.newPassword.$error }" name="txtNewPassword" v-model="newPassword">
                </div>
                <div class="offset-md-6 col-md-6 field-error-message">
                    <span v-if="$v.newPassword.$error && !$v.newPassword.required">New password is required.</span>
                </div>
            </div>
            <div class="form-group row">
                <label for="txtNewPasswordConf" class="col-md-6 col-form-label">
                    Confirm New Password  <span v-if="$v.newPasswordConf.$error" class="error-asterisk">*</span>
                </label>
                <div class="col-md-6">
                    <input type="password" class="form-control" v-bind:class="{ 'invalid-field': $v.newPasswordConf.$error }" name="txtNewPasswordConf" v-model="newPasswordConf">
                </div>
                <div class="offset-md-6 col-md-6 field-error-message">
                    <span v-if="$v.newPasswordConf.$error && !$v.newPasswordConf.required">New password confirmation is required.</span>
                    <span v-else-if="$v.newPasswordConf.$error && !$v.newPasswordConf.sameAsPassword">Confirmation password does not match new password.</span>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-12 text-center">
                    <button type="button" @click="submitForm" class="btn btn-primary"><i class="fas fa-key"></i> Change Password</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    
    import { required, sameAs } from 'vuelidate/lib/validators';
    import axios from "axios";

    export default {
        name: 'changePasswordApp',
        data () {
            return {
                currentPassword: '',
                newPassword: '',
                newPasswordConf: '',
                errorMessage: '',
                successfullyChangedPassword: false
            }
        },
        props: [
            'user',
            'showSuccessMessage',
            'requireCurrentPassword'
        ],
        validations: {
            currentPassword: {
                currentPasswordRequired(currentPassword) {
                    return (
                        !this.requireCurrentPassword ||
                        currentPassword
                    );
                }
            },
            newPassword: {
                required
            },
            newPasswordConf: {
                required,
                sameAsPassword: sameAs('newPassword')
            }
        },
        methods: {
            submitForm: async function (event) {
                //Reset error message
                this.errorMessage = '';

                //Check validation
                this.$v.$touch();

                if (!this.$v.$anyError) {

                    try {

                        //Verify current password
                        if (this.requireCurrentPassword) {
                            let verifyPassRes = await axios
                                .post('/userapi/verifypassword/' + this.user.id, {
                                    password: this.currentPassword
                                });
                            if (!verifyPassRes.data.isPasswordVerified) {
                                this.errorMessage = 'Invalid current password.';
                                return;
                            }
                        }

                        axios.defaults.headers.common['x-access-token'] = $cookies.get('DWWebsite_token');

                        //Change password
                        let changePassRes = await axios
                        .patch('/userapi/users/' + this.user.id, {
                            password: this.newPassword
                        });
                       
                        if (!changePassRes.data.errorMessage) {
                            this.successfullyChangedPassword = true;

                            //Reset fields and validations
                            this.$v.$reset();

                            this.currentPassword = '';
                            this.newPassword = '';
                            this.newPasswordConf = '';

                            //Fire an event containing the data.
                            this.$emit('password-changed', {
                                id: this.user.id,
                                firstName: this.firstName,
                                middleName: this.middleName,
                                lastName: this.lastName,
                                email: this.email,
                                userName: this.userName
                                });
                        } else {
                            this.errorMessage = changePassRes.data.errorMessage;
                        }
                    } catch(err) {
                        console.log(err);
                        this.errorMessage = err;
                    }
                }
            },
        }
    };
</script>