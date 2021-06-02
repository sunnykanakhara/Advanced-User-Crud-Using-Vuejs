<template>
  <div>
    <h1>Registration</h1>
    User Name: <input type="text" v-model="name" /><br /><br />
    Password: <input type="password" v-model="password" /><br /><br />
    Age: <input type="number" v-model="age" /><br /><br />
    <input
      type="button"
      value="Register"
      class="register"
      @click="registerUser"
    />
    <input type="button" value="Login" @click="routeToLogin" />
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
      age: "",
    };
  },
  computed: {
    ...mapGetters("user", ["loggedIn"]),
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
    registerUser() {
      if (this.name == "" || this.password == "" || this.age == "") {
        this.$toast.open({
          message: "Please fill all the empty fields",
          type: "error",
          position: "top-right",
        });
      } else {
        let uniqueId = Date.now().toString();
        let user = {
          id: CryptoJS.AES.encrypt(uniqueId, "secret key 123").toString(),
          name: CryptoJS.AES.encrypt(this.name, "secret key 123").toString(),
          password: CryptoJS.AES.encrypt(
            this.password,
            "secret key 123"
          ).toString(),
          age: CryptoJS.AES.encrypt(this.age, "secret key 123").toString(),
        };
        this.$store.dispatch("user/addUser", user);
        let login = {
          isAuthorised: true,
          token: user.id,
        };
        this.$store.dispatch("user/loggedIn", login);
        this.$router.push({ name: "Profile", params: { id: user.id } });
        this.$toast.open({
          message: "You have registered successfully",
          type: "success",
          position: "top-right",
        });
      }
    },

    routeToLogin() {
      this.$router.push({ name: "Login" });
    },
  },
};
</script>

<style lang="scss">
.register {
  background-color: blue;
  color: white;
  margin-right: 15px;
}
</style>
