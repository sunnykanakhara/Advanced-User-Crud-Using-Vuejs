<template>
    <div>
        <div>
            <h1>User Profile</h1>
            <input type="button" value="Logout" @click="logoutUser">
            <input type="button" v-if="updateProfile" value="Update Profile" @click="updateAccount" class="update">
            <input type="button" v-else value="Update" @click="getValues" class="update">
            <input type="button" value="Delete Account" @click="deleteAccount" class="delete">
        </div><br>
        
        <div v-if="updateProfile">
            User Name: <input type="text" v-model="name"><br><br>
            Password: <input type="password" v-model="password"><br><br>
            Age: <input type="number" v-model="age"><br><br>
        </div>
        <div v-else>
            User Name: {{name}} <br><br>
            Password: {{password}} <br><br>
            Age: {{age}}
        </div>
    </div>
</template>

<script>
    var CryptoJS = require("crypto-js");
    import {mapGetters} from 'vuex';
    export default {
        data() {
            return {
                name: '',
                password: '',
                age: '',
                userId: null,
                updateProfile: false
            }
        },
        computed: {
            ...mapGetters({
                users: 'user/users',
                loggedIn: 'user/loggedIn'
            })
        },
        watch: {
            loggedIn: {
                immediate: true,
                handler(loggedIn) {
                    if(loggedIn == null) {
                        this.$router.push({name: 'Login'})
                    }
                }
            }
        },
        created() {
            this.userId = this.$route.params.id.replace(/%2F/g, '/');
            this.fillProfile()
        },
        methods: {
            fillProfile() {
                for(let key of this.users) {
                    if(this.userId == key.id) {
                        this.name = CryptoJS.AES.decrypt(key.name, 'secret key 123').toString(CryptoJS.enc.Utf8);
                        this.password = CryptoJS.AES.decrypt(key.password, 'secret key 123').toString(CryptoJS.enc.Utf8);
                        this.age = CryptoJS.AES.decrypt(key.age, 'secret key 123').toString(CryptoJS.enc.Utf8);
                    }
                }
            },

            logoutUser() {
                this.$store.dispatch('user/loggedIn', null)
                this.$router.push({name: 'Login'})
                this.$toast.open({
                    message: 'You have logged out successfully',
                    type: 'success',
                    position: 'top-right'
                });
            },

            getValues() {
                this.updateProfile = true;
            },

            updateAccount() {
                if(this.name == '' || this.password == '' || this.age == '') {
                    this.$toast.open({
                        message: 'Please fill all the empty fields',
                        type: 'error',
                        position: 'top-right'
                    });   
                } else {
                    this.updateProfile = false;
                    this.users.map(value => {
                        if(this.userId == value.id) {
                            value.name = CryptoJS.AES.encrypt(this.name, 'secret key 123').toString(),
                            value.password = CryptoJS.AES.encrypt(this.password, 'secret key 123').toString(),
                            value.age = CryptoJS.AES.encrypt(this.age, 'secret key 123').toString()
                        }
                    })
                    this.$store.dispatch('user/UpdateAccount', this.users)
                    this.$toast.open({
                        message: 'Your details updated successfully',
                        type: 'success',
                        position: 'top-right'
                    });
                }
            },

            async deleteAccount() {
                let removedUserArray = this.users.filter(user => {
                    return this.userId != user.id;
                })
                await this.$store.dispatch('user/DeleteAccount', removedUserArray)
                this.$store.dispatch('user/loggedIn', null)
                this.$router.push({name: 'Login'})
                this.$toast.open({
                    message: 'Your account deleted successfully',
                    type: 'success',
                    position: 'top-right'
                });
            }
        },
    }
</script>

<style lang="scss">
.update{
    margin-left: 15px;
}

.delete{
    background-color: red; 
    color: white; 
    margin-left: 15px;
}
</style>