<template>
  <v-container>
    <v-layout row v-if="error">
      <v-flex xs12 sm6 offset-sm3>
        <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm4 offset-sm4>
        <form @submit.prevent="onSignin">
          <transition name="fade" mode="out-in">
            <v-card v-if="step == 0" key="0">
              <v-container>
                <v-card-title primary-title>
                  <div>
                    <h2 class="mb-0 primary--text">Sign In</h2>
                  </div>
                </v-card-title>
                <v-card-text>
                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field name="email" label="Mail" id="email" v-model="email" type="email" required flat></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs12>
                      <v-btn block color="primary" @click="step=1">next</v-btn>
                    </v-flex>
                  </v-layout>
                  <v-divider class="mt-3 mb-5"></v-divider>
                  <v-layout row>
                    <v-flex xs12>
                      <v-btn block color="white" @click="onGoogleSignin">
                        <v-icon left color="red">fab fa-google</v-icon>
                        Sign in with Google</v-btn>
                    </v-flex>
                  </v-layout>
                </v-card-text>
                <v-card-text>
                  <div class="loading" v-if="loading">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  </div>
                </v-card-text>
              </v-container>
            </v-card>
            <v-card v-if="step == 1" key="1">
              <v-container>
                <v-card-title primary-title>
                  <div>
                    <h2 class="mb-0">
                    <v-btn icon small class="hidden-xs-only ml-0" @click="step=0" color="primary">
                      <v-icon>arrow_back</v-icon>
                    </v-btn>Sign In to Your Account</h2>
                  </div>
                </v-card-title>
                <v-card-text>
                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field name="password" label="Password" id="password" v-model="password" type="password" required></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs12 text-xs-right>
                      <v-btn block type="submit" color="primary">Sign in</v-btn>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs12>
                      <v-btn small flat block color="primary" @click="onChangePassword">Rest password</v-btn>
                    </v-flex>
                  </v-layout>
                </v-card-text>
                <v-card-text>
                  <div class="loading" v-if="loading">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  </div>
                </v-card-text>
              </v-container>
            </v-card>
            <v-card v-if="step == 2" key="1">
              <v-container>
                <v-card-title primary-title>
                  <div>
                    <h2 class="mb-0">
                    <v-btn icon small class="hidden-xs-only ml-0" @click="onChangePassword" color="primary">
                      <v-icon>arrow_back</v-icon>
                    </v-btn>Reset Your Password</h2>
                  </div>
                </v-card-title>
                <v-card-text>
                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field name="password" label="Password" id="password" v-model="new_password" type="password" required></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs12>
                      <v-btn small block color="primary" @click="onChangePassword">Save new password</v-btn>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-container>
            </v-card>
          </transition>
        </form>
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
      new_password: "",
      step: 0,
      nextUrl: this.$route.query.nextUrl
    };
  },
  computed: mapGetters("users", ["user", "error", "loading"]),
  watch: {
    user: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.setCurLibId(newVal.uid);
          if (this.nextUrl) {
            this.$router.push(this.nextUrl);
          } else {
            this.$router.push("/" + newVal.uid + "/home");
          }
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions("users", [
      "signIn",
      "changePassword",
      "clearError",
      "setCurLibId",
      "googleSignIn"
    ]),
    onSignin() {
      this.signIn({
        email: this.email,
        password: this.password,
        localStorage: this.$localStorage,
        nextUrl: this.$route.query.nextUrl
      });
    },
    onDismissed() {
      this.clearError();
    },
    onGoogleSignin() {
      this.googleSignIn({
        localStorage: this.$localStorage
      });
    },
    onChangePassword() {
      this.changePassword(this.email);
    }
  },
  mounted() {
    console.log(this.nextUrl);
  }
};
</script>

<style scoped>
.loading {
  text-align: center;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
