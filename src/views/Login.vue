<template>
  <div>
    <h1>Login</h1>
    Username: <input type="text" v-model="name" /><br /><br />
    Password: <input type="password" v-model="password" /><br /><br />
    <input type="button" value="Login" class="login" @click="loginUser" />
    <input type="button" value="Register" @click="routeToRegister" />
  </div>
</template>

<script>
var CryptoJS = require("crypto-js");
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      name: "",
      password: "",
    };
  },
  computed: {
    ...mapGetters({
      users: "user/users",
      loggedIn: "user/loggedIn",
    }),
  },
  watch: {
    loggedIn: {
      immediate: true,
      handler(loggedIn) {
        if (loggedIn != null) {
          this.$router.push({
            name: "Profile",
            params: { id: loggedIn.token },
          });
        }
      },
    },
  },
  methods: {
    loginUser() {
      if (this.name == "" || this.password == "") {
        this.$toast.open({
          message: "Please fill all the empty fields",
          type: "error",
          position: "top-right",
        });
      } else {
        if (this.users.length) {
          for (let key = 0; key < this.users.length; key++) {
            if (
              this.name ==
                CryptoJS.AES.decrypt(
                  this.users[key].name,
                  "secret key 123"
                ).toString(CryptoJS.enc.Utf8) &&
              this.password ==
                CryptoJS.AES.decrypt(
                  this.users[key].password,
                  "secret key 123"
                ).toString(CryptoJS.enc.Utf8)
            ) {
              let login = {
                isAuthorised: true,
                token: this.users[key].id,
              };
              this.$store.dispatch("user/loggedIn", login);
              this.$router.push({
                name: "Profile",
                params: { id: this.users[key].id },
              });
              this.$toast.open({
                message: "You have logged in successfully",
                type: "success",
                position: "top-right",
              });
              return;
            } else if (key == this.users.length - 1) {
              this.$toast.open({
                message: "Incorrect Username or Password",
                type: "error",
                position: "top-right",
              });
            }
          }
        } else {
          this.$toast.open({
            message: "Please Register Yourself",
            type: "error",
            position: "top-right",
          });
        }
      }
    },

    routeToRegister() {
      this.$router.push({ name: "Register" });
    },
  },
};
</script>

<style lang="scss">
.login {
  background-color: blue;
  color: white;
  margin-right: 15px;
}
</style>
