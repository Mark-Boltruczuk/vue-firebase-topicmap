<template v-cloak>
  <v-app class="blue-grey darken-4">
    <div v-if="!$route.meta.plainLayout">
      <v-snackbar :timeout="timeout" :color="color" v-model="visible" top>
      {{ message }}
      </v-snackbar>
      <v-navigation-drawer
        v-model="drawer"
        class="pb-0 blue-grey darken-4"
        temporary
        absolute
        height="100%"
        light
      >
        <v-list dense class="blue-grey darken-2">
          <v-list-tile
            v-for="item in menuItems"
            :key="item.title"
            :to="item.link" exact>
            <v-list-tile-action>
              <v-icon class="primary" dark>{{item.icon}}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content class="white--text">{{item.title}}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            v-if="isUserSignedIn"
            @click.stop="onSignOut">
            <v-list-tile-action>
              <v-icon class="primary" dark>exit_to_app</v-icon>
            </v-list-tile-action>
            <v-list-tile-content class="white--text">Logout</v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar dark class="error">
        <v-toolbar-side-icon @click.stop="drawer=!drawer" class="hidden-sm-and-up">
        </v-toolbar-side-icon>
        <v-toolbar-title>
          <!-- <v-btn flat exact v-if="user === null" to="/" tag="span" style="cursor: pointer">Topic Map</v-btn> -->
          <v-btn flat exact v-if="(user !== null && curLibId===user.uid) || curLibId === null"  tag="span" style="cursor: pointer" @click="onNavigate(null)">Topic Map</v-btn>
          <v-btn flat exact v-if="user !== null && curLibId !== null && curLibId!==user.uid"  tag="span" style="cursor: pointer" @click="onNavigate(user.uid)">My Library</v-btn>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-xs-only">
          <v-btn flat v-for="item in menuItems" :key="item.title" :to="item.link" exact>
            <v-icon left>{{item.icon}}</v-icon>
            {{item.title}}
          </v-btn>
          <v-menu
            :close-on-content-click="false"
            v-model="menu"
            v-if="(joinedLibraries.length > 0 || teamMembers.length > 0)"
          >
            <v-btn  v-if="user.uid === library.creatorId" flat slot="activator">
              <v-badge v-model="show" color="cyan" left>
                <span slot="badge">{{joinedLibraries.length + teamMembers.length}}</span>
                  <v-icon left>email</v-icon>
              </v-badge>
              Notification
            </v-btn>
            <v-card v-for="(item, index) in joinedLibraries" :key="item.uid" width="300px">
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">{{item.jobTitle}}</h3>
                </div>
              </v-card-title>
              <v-card-text>
                <span class="grey--text">{{item.email}} sent invitation to join as team member</span>
                <div>{{item.jobDescription}}</div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" @click="selectAccept(item.uid)">Accept</v-btn>
                <v-btn color="error" @click="selectReject(item.uid)">Reject</v-btn>
              </v-card-actions>
              <v-divider v-if="index + 1 < joinedLibraries.length"></v-divider>
            </v-card>
            <v-card v-for="(item, index) in teamMembers" :key="item.uid" width="300px">
              <v-card-text primary-title @click="viewNotification(item.uid, item.status)">
                <span class="grey--text" v-if="item.status === 1">{{item.email}} accepted your invitation</span>
                <span class="grey--text" v-if="item.status === -1">{{item.email}} rejected your invitation</span>
              </v-card-text>
              <v-divider v-if="index + 1 < teamMembers.length"></v-divider>
            </v-card>
          </v-menu>
          <v-btn v-if="isUserSignedIn" flat @click="onSignOut">
            <v-icon left dark>exit_to_app</v-icon>
            Logout
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-content>
        <router-view></router-view>
      </v-content>
    </div>
    <div v-if="$route.meta.plainLayout" style="height: 100%;">
      <v-content>
        <router-view></router-view>
      </v-content>
    </div>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      row: null,
      show: true,
      drawer: false,
      visible: false,
      timeout: 3000,
      color: "success",
      message: "",
      fav: true,
      menu: false,
      message: false,
      hints: true
    };
  },
  computed: {
    ...mapGetters("users", ["user", "users", "isUserSignedIn", "curLibId"]),
    ...mapGetters("libraries", ["library", "loading"]),
    ...mapGetters({ userSnackbar: "users/snackbar" }),
    ...mapGetters({ librarySnackbar: "libraries/snackbar" }),
    ...mapGetters({ topicMapSnackbar: "topicMaps/snackbar" }),
    ...mapGetters({ boardSnackbar: "board/snackbar" }),
    menuItems() {
      let menuItems = [
        { icon: "swap_vert", title: "Sign In", link: "/signin" }
      ];
      if (this.isUserSignedIn) {
        menuItems = [
          { icon: "home", title: "Home", link: "/" + this.curLibId + "/home" },
          {
            icon: "bubble_chart",
            title: "Topicmaps",
            link: "/" + this.curLibId + "/topicmaps"
          },
          {
            icon: "view_list",
            title: "Explore",
            link: "/" + this.curLibId + "/subjectgate"
          },
          {
            icon: "person",
            title: "Profile",
            link: "/" + this.curLibId + "/profile"
          }
        ];
      }
      return menuItems;
    },
    joinedLibraries() {
      if (this.isUserSignedIn) {
        let joinedLibraries = [];
        for (let key in this.user.joinedLibraries) {
          if (this.user.joinedLibraries[key].status == 0) {
            joinedLibraries.push(this.users[key]);
          }
        }
        return joinedLibraries;
      }
      return [];
    },
    teamMembers() {
      if (this.isUserSignedIn && this.library) {
        let teamMembers = [];
        for (let key in this.library.teamMembers) {
          if (
            this.library.teamMembers[key].status == 1 ||
            this.library.teamMembers[key].status == -1
          ) {
            teamMembers.push({
              ...this.users[key],
              status: this.library.teamMembers[key].status,
              uid: key
            });
          }
        }
        return teamMembers;
      }
      return [];
    }
  },
  watch: {
    userSnackbar: {
      handler(value) {
        if (value.color) {
          this.visible = true;
          this.color = value.color;
          this.message = value.message;
        }
      },
      deep: true
    },
    librarySnackbar: {
      handler(value) {
        if (value.color) {
          this.visible = true;
          this.color = value.color;
          this.message = value.message;
        }
      },
      deep: true
    },
    boardSnackbar: {
      handler(value) {
        if (value.color) {
          this.visible = true;
          this.color = value.color;
          this.message = value.message;
        }
      },
      deep: true
    },
    topicMapSnackbar: {
      handler(value) {
        if (value.color) {
          this.visible = true;
          this.color = value.color;
          this.message = value.message;
        }
      },
      deep: true
    },
    loading: function(newVal, oldVal) {},
    curLibId: {
      handler(newVal, oldVal) {
        this.loadLibrary(newVal);
        this.loadLibraries();
      },
      deep: true
    }
  },
  methods: {
    ...mapActions("users", [
      "doJoinLibrary",
      "signOut",
      "setCurLibId",
      "initUser"
    ]),
    ...mapActions("libraries", [
      "doNotification",
      "loadLibrary",
      "loadLibraries",
      "init"
    ]),
    onSignOut() {
      this.init();
      this.initUser();
      this.signOut({localStorage: this.$localStorage});
      this.$router.push("/");
    },
    selectAccept(libraryId) {
      if (confirm("Are you sure to join this library?")) {
        this.doJoinLibrary({ id: libraryId, status: 1, uid: this.user.uid });
      }
      this.menu = false;
    },
    selectReject(libraryId) {
      if (confirm("Are you sure not to join this library?")) {
        this.doJoinLibrary({ id: libraryId, status: -1, uid: this.user.uid });
      }
      this.menu = false;
    },
    viewNotification(id, status) {
      this.doNotification({ id: id, status: status * 2, uid: this.user.uid });
    },
    onNavigate(uid) {
      if (uid === null || uid === undefined) {
        this.$router.push("/");
      } else {
        this.$router.push("/" + uid + "/home");
        this.setCurLibId(uid);
      }
    }
  }
};
</script>

<style lang="stylus">
                  

                                    

                                         

                                                                          

                   

                   

                          

                        

                                       

                 

                

                     

             

       

                                                 

                      

                                     

                             

                                  

                                

                                                                 

                                 

                                                                                         

                        

                      

                                 

                                    

                                

                                                               

                                 

                                                                                 

                        

                 

                            

                                    

                                                                                   

                              

                         

                                                                                                                     

                                                                                                                                                                              

                                                                                                                                                                                 

                          

                             

                                                

                                                                                        

                                               

                          

                  

                 

                                           

                          

                                                                         

           

                                                                                

                                                        

                                                                                         

                                             

                        

                          

                    

                                                                                           

                                          

                     

                                                                  

                      

                             

                           

                                                                                                     

                                                  

                            

                              

                                     

                                                                                     

                                                                                   

                               

                                                                               

                     

                                                                                       

                                                                                          

                                                                                                                

                                                                                                                 

                            

                                                                           

                     

                   

                                                               

                                                  

                  

                  

                          

                  

                 

                                   

                  

          

                                                              

                 

                                   

                  

          

          

           



        

                                              

                

          

            

                

                 

                    

                     

                    

                       

                  

                

                  

                     

                 

      

    

             

                                                                            

                                                       

                                                      

                                                             

                                                              

                                                       

                 

                       

                                                                

        

                                

                     

                                                                               

           

                                 

                               

                                                    

            

           

                              

                             

                                                      

            

           

                           

                             

                                                  

           

          

       

                       

      

                       

                                

                                 

                                                    

                                                           

                                                  

           

         

                               

       

                

      

                   

                                                

                             

                                                   

              

                                                        

                                                      

             

                              

                                 

                                                           

                      

               

           

         

                           

       

                

     

    

          

                   

                      

                          

                              

                                   

                                       

         

        

                

      

                      

                      

                          

                              

                                   

                                       

         

        

                

      

                    

                

                          

                              

                                   

                                       

         

        

                

      

                       

                      

                          

                              

                                   

                                       

         

        

                

      

                                         

               

                               

                                 

                             

        

                

     

    

            

                            

                      

                

                    

                

       

                                

                       

                    

                      

            

       

                 

                  

                      

                     

                             

      

                             

                                                          

                                                                             

       

                        

      

                             

                                                              

                                                                              

       

                        

      

                                  

                                                                              

      

                     

                                              

                               

              

                                               

                              

       

     

   

  

         



                     

// @import './stylus/main';

</style>
<style>
.application.theme--light a {
  text-decoration: none;
}
</style>
