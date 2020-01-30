<template>
    <div>
        <div class="row my-3">
            <div class="col-12 col-md-6">
                <b-button variant="primary" v-b-modal="'modal-create-user'"><i class="fas fa-user-plus"></i> Create User</b-button>
            </div>
            <label for="ddlSortOrder" class="col-form-label col-6 col-md-3 text-right">Sort Order:</label>
            <div class="col-6 col-md-3">
                <select class="form-control" id="ddlSortOrder" v-model="sortOrder">
                    <option value="firstName">First Name</option>
                    <option value="lastName">Last Name</option>
                    <option value="email">Email</option>
                    <option value="userName">User Name</option>
                    <option value="isAdmin">Admin</option>
                </select>
            </div>
        </div>
        <div class="row justify-content-center">
            <div v-for="aUser in sortedPagedUserList" class="col-md-12 col-lg-6 d-flex align-items-stretch" style="width: 100%;" :key=aUser.id>
                <div class="card flex-fill my-2" :class="{'border-dark': aUser.isAdmin}">
                    <h5 class="card-header">
                        {{ aUser.firstName }} {{ aUser.lastName }} <span v-if="aUser.isAdmin">(Admin)</span>
                    </h5>   
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12">
                                ID: {{ aUser.id }}<br/>
                                First Name: {{ aUser.firstName }}<br/>
                                Middle Name: {{ aUser.middleName }}<br/>
                                Last Name: {{ aUser.lastName }}<br/>
                                Email: <a :href="'mailto:' + aUser.email">{{ aUser.email }}</a><br/>
                                Admin User: {{ aUser.isAdmin ? 'Yes' : 'No' }}
                            </div>  
                        </div> 
                        <div class="row">
                            <div class="col-12 text-center my-2">
                                <b-button variant="primary" v-b-modal="'modal-edit-user-' + aUser.id" class="btn-block"><i class="fas fa-pencil-alt"></i> Edit User</b-button>
                            </div>
                            <div class="col-12 text-center my-2">
                                <b-button variant="primary" v-b-modal="'modal-change-password-' + aUser.id" class="btn-block"><i class="fas fa-key"></i> Change Password</b-button>
                            </div>
                            <div v-if="!isDefaultAdminOrLoggedInUser(aUser)" class="col-12 text-center my-2">
                                <b-button variant="danger" v-b-modal="'modal-delete-user-' + aUser.id" class="btn-block"><i class="fas fa-trash"></i> Delete</b-button>
                            </div>
                        </div>
                    </div>
                </div>
                <b-modal :id="'modal-edit-user-' + aUser.id" :title="'Edit ' + aUser.firstName + ' ' + aUser.lastName" size="xl" hide-footer>
                    <edit-user
                        :user = "aUser"
                        :show-success-message = "false"
                        @user-updated = "onUserUpdated"
                    ></edit-user>
                </b-modal>
                <b-modal :id="'modal-change-password-' + aUser.id" :title="'Change Password for ' + aUser.firstName + ' ' + aUser.lastName" hide-footer>
                    <change-password
                        :user = "aUser"
                        :show-success-message = "false"
                        :require-current-password = "loggedInUser.id == aUser.id"
                        @password-changed = "onPasswordChanged"
                    ></change-password>
                </b-modal>
                <b-modal
                    :id="'modal-delete-user-' + aUser.id" 
                    :title="'Delete ' + aUser.firstName + ' ' + aUser.lastName"
                    ok-variant="danger"
                    ok-title="Yes"
                    cancel-title="No"
                    @ok="deleteUser(aUser)"
                    >
                    This action will delete the user {{ aUser.firstName }} {{ aUser.lastName }} permanently. Are you sure you want to do this?
                </b-modal>
            </div>
        </div>
        <div v-show="userList.length > perPage" class="row my-3">
            <div class="col-12">
                <b-pagination
                    v-model="currentPage"
                    :total-rows="userList.length"
                    :per-page="perPage"
                    align="center"
                ></b-pagination>
            </div>
        </div>
        <b-modal id="modal-create-user" title="Create New User" size="xl" hide-footer>
            <create-user
                @user-created="onUserCreated"
            ></create-user>
        </b-modal>
    </div>
</template>

<script>

    import { required, email } from 'vuelidate/lib/validators';
    import axios from 'axios';
    import _ from 'lodash';
    import EditUser from './EditUser.vue';
    import ChangePassword from './ChangePassword.vue'
    import CreateUser from './CreateUser.vue'

    export default {
        name: 'manageUsersApp',
        data () {
            return {
                userList: [],
                password: '',
                loggedInUser: $cookies.get('DWWebsite_user'),
                sortOrder: 'lastName',
                currentPage: 1,
                perPage: 10
            }
        },
        components: {
            CreateUser,
            EditUser,
            ChangePassword
        },
        async created () {

            try {

                //Fetch the user list.            
                axios.defaults.headers.common['x-access-token'] = $cookies.get('DWWebsite_token');
            
                let res = await axios
                .get('/userapi/users');

                this.userList = res.data.userList;

            } catch(err) {
                console.log(err);
            }

        },
        watch: {
            sortOrder: function (val) {
                //Reset page number to one.
                this.currentPage = 1;
            }
        },
        computed: {
            sortedPagedUserList: function () {

            var pageStartIndex = ((this.currentPage - 1) * this.perPage);
            var pageEndIndex = Math.min(pageStartIndex + this.perPage, this.userList.length);

            return _.orderBy(this.userList, this.sortOrder, 'asc').slice(pageStartIndex, pageEndIndex);
            },
            numberOfPages: function () {
                return Math.ceil(this.userList.length / this.perPage);
            }
        },
        methods: {
            onUserCreated: function (newUser) {

                //Close the modal
                this.$bvModal.hide('modal-create-user');

                //Add the new user to the user list.
                this.userList.push(newUser);
            },
            onUserUpdated: function (updatedUser) {

                //Close the modal
                this.$bvModal.hide('modal-edit-user-' + updatedUser.id);

                //Find and update the record.
                var aUser = _.find(this.userList, {id: updatedUser.id});
                aUser.firstName = updatedUser.firstName;
                aUser.middleName = updatedUser.middleName;
                aUser.lastName = updatedUser.lastName;
                aUser.email = updatedUser.email;
                aUser.userName = updatedUser.userName;
                aUser.isAdmin = updatedUser.isAdmin;

            },
            onPasswordChanged: function(updatedUser) {
                //Close the modal
                this.$bvModal.hide('modal-change-password-' + updatedUser.id);
            },
            deleteUser: async function(userToDelete) {

                 try {
                    
                    axios.defaults.headers.common['x-access-token'] = $cookies.get('DWWebsite_token');

                    let res = await axios
                    .delete('/userapi/users/' + userToDelete.id);

                    //Remove user from userlist (using lodash _.remove doesn't trigger reactive behavior, which is why _.filter is used).
                    this.userList = _.filter(this.userList, function(user) {
                        return user.id != userToDelete.id;
                    });

                }
                catch(err) {
                    console.log(err);
                }

            },
            isDefaultAdminOrLoggedInUser: function (aUser) {
                return aUser.userName == 'admin' ||
                       aUser.id == this.loggedInUser.id;
            }
        }
    };
</script>