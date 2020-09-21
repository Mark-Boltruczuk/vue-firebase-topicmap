<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm4 offset-sm4>
        <v-card>
          <v-card-text>
            <v-container>
              <v-layout row>
                <v-flex xs12>
                  <h2 class="mb-0 primary--text">Create Account</h2>
                </v-flex>
              </v-layout>
              <form @submit.prevent="onSignup">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field 
                      name="email" 
                      label="Mail" 
                      id="email" 
                      v-model="email" 
                      type="email" 
                      required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field 
                      name="password" 
                      label="Password" 
                      id="password" 
                      v-model="password" 
                      type="password" 
                      required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field 
                      name="confirmPassword" 
                      label="Confirm Password" 
                      id="confirmPassword" 
                      v-model="confirmPassword" 
                      type="password" 
                      :rules="[comparePasswords]"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12 text-xs-right>
                    <v-btn 
                      type="submit" 
                      color="primary">Sign up</v-btn>
                  </v-flex>
                </v-layout>
                <v-divider class="mt-3 mb-5"></v-divider>
                <v-layout row>
                  <v-btn block color="white" @click="onGoogleSignin">
                    <v-icon left color="red">fab fa-google</v-icon>
                    Sign in with Google
                  </v-btn>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
          <v-card-text>
            <div class="loading" v-if="loading">
              <v-progress-circular 
                indeterminate 
                color="primary"></v-progress-circular>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: ""
    };
  },
  computed: {
    ...mapGetters("users", ["user", "error", "loading"]),
    comparePasswords() {
      return this.password !== this.confirmPassword
        ? "Password do not match"
        : "";
    }
  },
  watch: {
    user: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.setCurLibId(newVal.uid);
          this.$router.push("/" + newVal.uid + "/home");
        }
      },
      deep: true
    },
    error: function(newVal, oldVal) {
      if (newVal == 'error1') {
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
      }
    }
  },
  methods: {
    ...mapActions("users", ["signUp", "clearError", "setCurLibId", "googleSignIn"]),
    onSignup() {
      this.signUp({ email: this.email, password: this.password });
    },
    onDismissed() {
      this.clearError();
    },
    onGoogleSignin() {
      this.googleSignIn();
    }
  }
};
</script>

<style scoped>
.loading {
  text-align: center;
}
</style>



