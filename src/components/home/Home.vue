 <template>
  <v-container grid-list-md>
    <v-dialog 
      v-model="invite" 
      persistent 
      max-width="500px" width="400px"
    >
      <v-card>
        <v-card-title>
          Invitation For Joining Team Members.
        </v-card-title>
        <v-card-text>
          <v-text-field 
            name="input-1-3" 
            label="Prospective Team Member's email" 
            single-line 
            :rules="emailRules" 
            prepend-icon="email" 
            required 
            v-model="teamMember"
          >
          </v-text-field>
          <v-alert 
            :value="alert" 
            error 
            transition="scale-transition"
          >
            There is no such email address
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click.stop="invite=false">Close</v-btn>
          <v-btn color="success" flat @click.stop="onSendInvite">Send</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-layout row>
      <v-flex 
        xs12 sm6 mb-3 
        offset-sm3
        v-show="editable"
      >
        <h2 class="primary--text">Library Settings</h2>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <v-form 
          ref="form" 
          @submit.prevent="onSetLibrary"
          v-show="editable"
        >
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="title"
                label="Library Title"
                placeholder="Library or Your Name"
                id="title"
                v-model="library.title"
                required
                dark
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-textarea
                name="description"
                label="Description"
                id="description"
                placeholder="Introducing your library"
                v-model="library.description"
                dark
                required
              ></v-textarea>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-select
                label="Library Type"
                v-model="library.category"
                :items="categories"
                class="input-group--focused"
                dark
                required
              ></v-select>              
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn 
                raised 
                class="primary" 
                @click="onPickFile"
              >Upload Image</v-btn>
              <input type="file" 
                style="display: none" 
                ref="fileInput" 
                accept="image/*" @change="onFilePicked"
              />
            </v-flex>
            <v-flex xs12 sm6 offset-sm5>
              <img :src="library.imageUrl" height="150" />
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field 
                name="Street" 
                label="Address: Street" 
                id="address" 
                v-model="library.address.street" 
                dark
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field 
                name="City" 
                label="Address: City" 
                id="address" 
                v-model="library.address.city" 
                dark
                required
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field 
                name="Phone" 
                label="Phone" 
                id="phone" 
                v-model="library.contacts.phone" 
                prepend-icon="phone" 
                dark
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field 
                name="email" 
                label="Email" 
                id="email" 
                v-model="library.contacts.email" 
                :rules="emailRules" 
                prepend-icon="email" 
                dark
                required
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
            <div class="text-xs-center">
              <v-progress-circular v-if="creating" indeterminate color="blue"></v-progress-circular>
              <v-progress-circular v-if="updating" indeterminate color="blue"></v-progress-circular>
            </div>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex d-flex xs12 sm6 md7>
        <v-card class="blue-grey darken-1" dark>
          <v-card-actions 
            class="red lighten-1 dark"
            v-if="libraryId === user.uid"
          >
            <span class="title white--text">About {{library.title}}</span>
            <v-spacer></v-spacer>
            <v-tooltip left>
              <v-btn 
                @click="editable=!editable" 
                slot="activator" dark icon
              >
                <v-icon dark>edit</v-icon>
              </v-btn>
              <span>Edit Library Settings</span>
            </v-tooltip>
          </v-card-actions>
          <v-card-text 
            v-if="libraryId !== user.uid"
            class="red lighten-1 dark">
            <span class="title white--text">About {{library.title}}</span>
          </v-card-text>
          <v-card-text>
            {{library.description}}
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 sm6 md5>
        <v-card>
          <v-card-media :src="library.imageUrl" height="300px">
          </v-card-media>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 class="mt-3">
        <v-card>
          <v-card-actions v-if="userIsTeamMember" class="red lighten-1 dark">
            <span class="title white--text">Latest Topic Maps</span>
            <v-spacer></v-spacer>
            <v-tooltip left>
              <v-btn 
                :to="'/' + libraryId + '/topicmap/mapcontrol'" 
                slot="activator"
                dark icon
              >
                <v-icon dark>widgets</v-icon>
              </v-btn>
              <span>Map Control</span>
            </v-tooltip>
          </v-card-actions>
          <v-card-text v-if="!userIsTeamMember" class="red lighten-1 dark">
            <span class="title white--text">Latest Topic Maps</span>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 sm4 md4 lg4>
        <v-card-title v-if="latestTopicMaps.length === 0" class="white--text">
          There is no topic maps
        </v-card-title>
        <v-expansion-panel expand dark>
          <v-expansion-panel-content dark 
            v-for="(topicMap, i) in latestTopicMaps" 
            :key="topicMap.id" 
            v-if="i < latestTopicMaps.length/3"
          >
            <div slot="header">{{topicMap.name|toUppercase}}</div>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>{{topicMap.description}}</v-card-text>
            </v-card>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>Creator: {{users[topicMap.creatorId].firstname + ' ' + users[topicMap.creatorId].lastname}}</v-card-text>
            </v-card>         
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                :to="'/'+ libraryId + '/topicmaps/' + topicMap.id" 
                class="orange--text" flat>View Topic Map
              </v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
      <v-flex xs12 sm4 md4 lg4>
        <v-expansion-panel expand dark>
          <v-expansion-panel-content dark
            v-for="(topicMap, i) in latestTopicMaps" 
            :key="topicMap.id" 
            v-if="latestTopicMaps.length/3 <= i && i < latestTopicMaps.length/3 * 2">
            <div slot="header">{{topicMap.name|toUppercase}}</div>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>{{topicMap.description}}</v-card-text>
            </v-card>
            <v-card class="blue-grey darken-1">
              <v-card-text>Creator: {{users[topicMap.creatorId].firstname + ' ' + users[topicMap.creatorId].lastname}}</v-card-text>
            </v-card>         
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                :to="'/'+ libraryId + '/topicmaps/' + topicMap.id" 
                class="orange--text" flat
              >View Topic Map</v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
      <v-flex xs12 sm4 md4 lg4>
        <v-expansion-panel expand dark>
          <v-expansion-panel-content dark 
            v-for="(topicMap, i) in latestTopicMaps" 
            :key="topicMap.id" 
            v-if="latestTopicMaps.length/3*2 <= i"
          >
            <div slot="header">{{topicMap.name|toUppercase}}</div>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>{{topicMap.description}}</v-card-text>
            </v-card>
            <v-card class="blue-grey darken-1 dark">
              <v-card-text>Creator: {{users[topicMap.creatorId].firstname + ' ' + users[topicMap.creatorId].lastname}}</v-card-text>
            </v-card>         
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                :to="'/'+ libraryId + '/topicmaps/' + topicMap.id" 
                class="orange--text" flat
              >View Topic Map</v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 class="mt-3">
        <v-card class="blue-grey darken-1" dark>
          <v-card-actions v-if="libraryId === user.uid" class="red lighten-1 dark">
            <span class="title white--text">Our Team</span>
            <v-spacer></v-spacer>
            <v-tooltip left >
              <v-btn @click.native="invite=true" slot="activator" dark icon>
                <v-icon dark>group_add</v-icon>
              </v-btn>
              <span>Invite Team Member</span>
            </v-tooltip>
          </v-card-actions>
          <v-card-text v-if="libraryId !== user.uid" class="red lighten-1 dark">
            <span class="title white--text">Our Team</span>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout v-if="loadedLibrary" row wrap>
      <v-flex xs12 sm4 v-for="(teamMember) in teamMembers" :key="teamMember.id">
        <v-card flat class="blue-grey darken-1 dark">
          <v-card-text class="white--text">
            <h3 class="orange--text">
              {{users[teamMember.uid].firstname}} {{users[teamMember.uid].lastname}}
            </h3>
            <br/>
            <p>{{users[teamMember.uid].jobTitle}}</p>
            <p>{{users[teamMember.uid].email}}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat exact 
              v-if="libraryId !== teamMember.uid"
              class="info--text" 
              @click="onNavigate(teamMember.uid)"
            >{{users[teamMember.uid].displayName}} Library</v-btn>
            <v-btn flat exact 
              v-if="libraryId === teamMember.uid"
              class="orange--text" 
            >Super Admin</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 mt-3>
        <v-card class="blue-grey darken-1 dark">
          <v-card-text class="red lighten-1 dark">
            <span class="title white--text">Contacts</span>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <v-list class="blue-grey darken-1 dark">
          <v-list-tile>
            <v-list-tile-action>
              <v-icon class="white--text">phone</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="white--text">
                {{library.contacts.phone}}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
      <v-flex xs12 sm6>
        <v-list class="blue-grey darken-1 dark">
          <v-list-tile>
            <v-list-tile-action>
              <v-icon class="white--text">mail</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="white--text">
                {{library.contacts.email}}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <v-list two-line class="blue-grey darken-1 dark mt-1">
          <v-list-tile>
            <v-list-tile-action>
              <v-icon class="white--text">location_on</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="white--text">
                {{library.address.street}}
              </v-list-tile-title>
              <v-list-tile-sub-title class="white--text">
                {{library.address.city}}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
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
      alert: false,
      teamMember: null,
      invite: false,
      valid: true,
      name: "",
      nameRules: [v => !!v || "Name is required"],
      email: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be valid"
      ],
      select: null,
      //items: ["Item 1", "Item 2", "Item 3", "Item 4"],
      //checkbox: false,
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      show: false,
      editable: false,
      categories: [
        "Personal Library",
        "School Library",
        "College Library",
        "Tertiary Library",
        "Public Library",
        "Special Library",
        "Company Library"
      ],
      image: null,
      library: {
        image: null,
        title: "",
        description: "",
        imageUrl: "../static/library.png",
        category: "",
        address: {
          street: "",
          city: ""
        },
        contacts: {
          email: "",
          phone: ""
        },
        teamMembers: []
      }
    };
  },
  computed: {
    ...mapGetters("users", ["user", "users", "isUserSignedIn", "curLibId"]),
    ...mapGetters({ loadedLibrary: "libraries/library" }),
    ...mapGetters("libraries", ["loading", "creating", "updating"]),
    latestTopicMaps() {
      let topicMaps = [];
      if (this.loadedLibrary) {
        for (let key in this.loadedLibrary.topicMaps) {
          if (this.loadedLibrary.topicMaps[key].mapType == "public") {
            topicMaps.push({ ...this.loadedLibrary.topicMaps[key], id: key });
          }
        }
        topicMaps.sort((topicmapA, topicmapB) => {
          return topicmapB.date > topicmapA.date;
        });
        return topicMaps.slice(0, 6);
      }
      return [];
    },
    formIsValid() {
      return (
        this.library.title !== "" &&
        this.library.description !== "" &&
        this.library.imageUrl !== "" &&
        this.library.category !== "" &&
        this.library.address.street !== "" &&
        this.library.address.city !== "" &&
        this.library.contacts.email !== "" &&
        this.library.contacts.phone !== ""
      );
    },
    userIsCreator() {
      if (!this.isUserSignedIn) {
        return false;
      }
      return this.user.uid === this.library.creatorId;
    },
    userIsTeamMember() {
      for (let key in this.teamMembers) {
        if (this.user.uid === this.teamMembers[key].uid) {
          return true;
        }
      }
      return false;
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
    ...mapActions("libraries", [
      "create",
      "save",
      "download",
      "createLibrary",
      "updateLibrary",
      "loadLibraries"
    ]),
    ...mapActions("users", ["sendInvite", "setCurLibId"]),
    onEditBtnClk() {
      if (this.isUserSignedIn) {
        this.dialog = true;
      }
    },
    onSetLibrary() {
      if (!this.$refs.form.validate()) {
        return false;
      }
      let library = {
        ...this.library,
        creatorId: this.user.uid
      };
      if (this.loadedLibrary) {
        if (this.loadedLibrary.imageUrl !== this.library.imageUrl) {
          library.image = this.image;
        }
        this.updateLibrary(library);
      } else {
        if (this.image) {
          library.image = this.image;
        }
        library.teamMembers[this.user.uid] = { status: 2 };
        this.createLibrary(library);
      }
      this.editable = false;
    },
    cancel() {
      this.editable = false;
    },
    onPickFile() {
      this.$refs.fileInput.click();
    },
    onFilePicked(event) {
      const files = event.target.files;
      let filename = files[0].name;
      if (filename.lastIndexOf(".") <= 0) {
        return alert("Please add a valied file!");
      }

      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.library.imageUrl = fileReader.result;
      });

      fileReader.readAsDataURL(files[0]);
      this.image = files[0];
    },
    onSendInvite() {
      for (let key in this.users) {
        if (this.teamMember === this.users[key].email) {
          this.sendInvite({
            key: key,
            library: this.user.uid
          });
          this.invite = false;
          return;
        }
      }
      this.alert = true;
      setTimeout(() => {
        this.alert = false;
      }, 3500);
    },
    onNavigate(uid) {
      if (uid === null || uid === undefined) {
        this.$router.push("/");
      } else {
        this.$router.push("/" + uid + "/home");
        this.setCurLibId(uid);
      }
    }
  },
  filters: {
    toUppercase(value) {
      return value.toUpperCase();
    }
  },
  watch: {
    loadedLibrary: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.library.title = newVal.title ? newVal.title : "";
          this.library.description = newVal.description
            ? newVal.description
            : "";
          this.library.category = newVal.category ? newVal.category : "";
          this.library.address = newVal.address
            ? Object.assign({}, newVal.address)
            : {
                street: "",
                city: ""
              };
          this.library.contacts = newVal.contacts
            ? Object.assign({}, newVal.contacts)
            : {
                email: "",
                phone: ""
              };
          if (newVal.imageUrl) {
            this.library.imageUrl = newVal.imageUrl;
          }
          this.library.teamMembers = Object.assign({}, newVal.teamMembers);
          this.dialog = false;
        }
      },
      deep: true
    }
  },
  created: function() {
    this.setCurLibId(this.libraryId);
    this.loadLibraries();
    if (this.loadedLibrary) {
      this.library.title = this.loadedLibrary.title
        ? this.loadedLibrary.title
        : "";
      this.library.description = this.loadedLibrary.description
        ? this.loadedLibrary.description
        : "";
      this.library.category = this.loadedLibrary.category
        ? this.loadedLibrary.category
        : "";
      this.library.address = this.loadedLibrary.address
        ? Object.assign({}, this.loadedLibrary.address)
        : {
            street: "",
            city: ""
          };
      this.library.contacts = this.loadedLibrary.contacts
        ? Object.assign({}, this.loadedLibrary.contacts)
        : {
            email: "",
            phone: ""
          };
      if (this.loadedLibrary.imageUrl) {
        this.library.imageUrl = this.loadedLibrary.imageUrl;
      }
      this.library.teamMembers = Object.assign(
        {},
        this.loadedLibrary.teamMembers
      );
    }
  }
};
</script>


<style scoped>
.application--light .dialog__content .card {
  background: white;
  color: black;
}
#public-title {
  cursor: pointer;
}
a {
  color: orange;
  text-decoration: none;
}
a:hover {
  color: yellow;
}
.application--light .card {
  background-color: inherit;
  color: white;
}
.loading {
  text-align: center;
  color: black;
}
</style>
<style>
.dialog--fullscreen {
  background-color: white;
}
</style>
