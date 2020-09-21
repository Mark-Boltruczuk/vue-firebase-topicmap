<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex 
        xs12 sm6 mb-3 
        offset-sm3
        v-show="editable"
      >
        <h2 class="primary--text">Profile Settings</h2>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <v-form 
          ref="form" 
          @submit.prevent="onSetProfile"
          v-show="editable"
        >
          <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="displayname"
                label="Display Name"
                placeholder="Your Username"
                id="displayname"
                v-model="user.displayName"
                required
                dark
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field 
                name="jobtitle"
                label="Job Title"
                placeholder="Student or Teacher or Librarian"
                id="jobtitle"
                v-model="user.jobTitle"
                required
                dark
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
              <v-textarea
                name="description"
                label="Job Description"
                id="description"
                placeholder="Introducing your main roles"
                v-model="user.jobDescription"
                required
                dark
              ></v-textarea>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="firstname"
                label="First Name"
                id="firstname"
                placeholder="Your First name"
                v-model="user.firstname"
                required
                dark
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="lastname"
                label="Last Name"
                id="lastname"
                placeholder="Your Last Name"
                v-model="user.lastname"
                required
                dark
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="email"
                label="E-mail"
                id="email"
                v-model="user.email" 
                :rules="emailRules" 
                required
                dark
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout mb-3 row>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn 
                class="primary"
                :disabled="!formIsValid"
                type="submit">Save</v-btn>
              <v-btn 
                class="primary" 
                @click="cancel">Cancel</v-btn>
            </v-flex>
            <div class="text-xs-center" v-if="updating">
              <v-progress-circular 
                indeterminate 
                color="blue"></v-progress-circular>
            </div>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card class="blue-grey darken-1" dark>
          <v-card-actions v-if="libraryId === signedUser.uid" class="red lighten-1 dark">
            <span class="title white--text">My Profile</span>
            <v-spacer></v-spacer>
            <v-tooltip left>
              <v-btn  @click="editable=!editable" slot="activator" dark icon>
                <v-icon dark>edit</v-icon>
              </v-btn>
              <span>Edit Profile</span>
            </v-tooltip>
          </v-card-actions>
          <v-card-text v-if="libraryId !== signedUser.uid" class="red lighten-1 dark">
            <span class="title white--text">My Profile</span>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <v-list class="blue-grey darken-1 dark">
          <v-list-tile>
            <v-list-tile-action>
              <v-icon class="white--text">face</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="white--text">{{user.firstname}} {{user.lastname}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
      <v-flex xs12 sm6>
        <v-list class="blue-grey darken-1 dark">
          <v-list-tile >
            <v-list-tile-action>
              <v-icon class="white--text">mail</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="white--text">{{user.email}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <v-list two-line class="blue-grey darken-1 dark">
          <v-list-tile>
            <v-list-tile-action>
              <v-icon class="white--text">business</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="white--text">{{user.jobTitle}}</v-list-tile-title>
              <v-list-tile-sub-title class="white--text">{{user.jobDescription}}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <v-list class="blue-grey darken-1 dark">
          <v-list-tile>
            <v-list-tile-action>
              <v-icon class="white--text">group_add</v-icon>
            </v-list-tile-action>
            <v-list-tile-title class="orange--text">Joined Libraries</v-list-tile-title>
            <v-btn
              flat
              exact
              v-for="joinedLibrary in user.joinedLibraries"
              :key="joinedLibrary.library"
              @click="onNavigate(joinedLibrary.library)"
              style="cursor: pointer"
              class="orange--text"
            >{{libraries[joinedLibrary.library].title === "" ? "Lib" : libraries[joinedLibrary.library].title|truncate}}</v-btn>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 mt-4>
        <v-card>
          <v-card-title class="red lighten-1" dark>
            <span class="title white--text">Team Member List</span>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 sm4 v-for="teamMember in teamMembers" :key="teamMember.id">
        <v-card class="blue-grey darken-1" dark>
          <v-card-text class="orange--text">
            <h3>
              {{users[teamMember.uid].firstname}} {{users[teamMember.uid].lastname}}
            </h3>
          </v-card-text>
          <v-card-title class="white--text">{{users[teamMember.uid].jobTitle}}</v-card-title>
          <v-card-text class="white--text">{{users[teamMember.uid].email}}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat exact
              v-show="libraryId !== teamMember.uid && libraryId === signedUser.uid"
              class="info--text"
              @click="onUnregister(teamMember.uid)"
            >Unregister</v-btn>
            <v-btn flat exact
              v-if="libraryId === teamMember.uid"
              class="orange--text"
            >Super Admin</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: ["libraryId"],
  data() {
    return {
      valid: true,
      editable: false,
      user: {
        displayName: "",
        email: "",
        jobTitle: "",
        jobDescription: "",
        firstname: "",
        lastname: ""
      },
      emailRules: [
        v => !!v || "E-mail is required",
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be valid"
      ]
    };
  },
  filters: {
    truncate(text) {
      if (text.length > 0) {
        return text.slice(0, 12) + (12 < text.length ? "..." : "");
      }
    }
  },
  computed: {
    ...mapGetters("users", ["users", "error", "updating", "isUserSignedIn"]),
    ...mapGetters({ signedUser: "users/user" }),
    ...mapGetters({
      loadedLibrary: "libraries/library",
      libraries: "libraries/libraries"
    }),
    formIsValid() {
      return (
        this.user.displayName !== "" &&
        this.user.jobTitle !== "" &&
        this.user.email !== "" &&
        this.user.jobDescription !== "" &&
        this.user.firstname !== "" &&
        this.user.lastname !== ""
      );
    },
    teamMembers() {
      if (this.isUserSignedIn && this.loadedLibrary) {
        let teamMembers = [];
        for (let key in this.loadedLibrary.teamMembers) {
          if (this.loadedLibrary.teamMembers[key].status >= 1) {
            teamMembers.push({
              ...this.users[key],
              status: this.loadedLibrary.teamMembers[key].status,
              uid: key
            });
          }
        }
        return teamMembers;
      }
      return [];
    }
  },
  methods: {
    ...mapActions("users", ["updateUser", "setCurLibId"]),
    ...mapActions("libraries", ["unregister", "loadLibraries"]),
    onSetProfile() {
      if (!this.$refs.form.validate()) {
        return false;
      }
      this.updateUser(this.user);
    },
    cancel() {
      this.editable = false;
    },
    onNavigate(library) {
      this.$router.push("/" + library + "/home");
      this.setCurLibId(library);
    },
    onUnregister(teamMemberId) {
      if (confirm("Are you sure to unregister this user?")) {
        this.unregister({ uid: this.libraryId, id: teamMemberId, status: -1 });
      }
    }
  },
  watch: {
    signedUser: {
      handler: function(newVal, oldVal) {
        this.editable = false;
        this.user = JSON.parse(JSON.stringify(newVal));
      },
      deep: true
    }
  },
  created: function() {
    this.setCurLibId(this.libraryId);
    this.loadLibraries();
    this.user = JSON.parse(JSON.stringify(this.users[this.libraryId]));
  }
};
</script>

<style scoped>
.loading {
  text-align: center;
}
</style>
