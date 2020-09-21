<template>
  <v-container>
    <section>
      <vue-particles id="particles-js" class="blue-grey darken-4"
        color="#fff"
        :particleOpacity="0.7"
        :particlesNumber="350"
        :particleSize="4"
        lineColor="#fff"
        :lineWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="3"
        :hoverEffect="true"
        hoverMode="grap"
        :clickEffect="true"
        clickMode="push"
      >
      </vue-particles>
    </section>

    <section class="white--text">
      <v-layout
        column
        wrap
        class="my-5"
        align-center
      >
        <v-flex xs12 sm6 class="text-xs-center">
          <div>
            <h2 class="headline white--text">Kick-start Visual Web Library Service Today!</h2>
          </div>
          <v-btn 
            class="blue lighten-2 mt-4 mb-4"
            :to="'/signup'"
            dark
            large
          >Get Started</v-btn>
        </v-flex>
        <v-flex xs12>
          <v-container grid-list-xl>
            <v-layout row wrap align-center blue-grey darken-3>
              <v-flex xs12 md4 mt-3>
                <v-card-text class="text-xs-center blue-grey darken-2">
                  <v-icon x-large class="blue--text text--lighten-2">publish</v-icon>
                </v-card-text>
                <v-card class="blue-grey darken-2">
                  <v-card-title secondary-title>
                    <div class="headline text-xs-center orange--text">I. Update Library Home</div>
                  </v-card-title>
                  <v-card-text class="white--text mb-3">
                  <ul>
                    <li>Signe-up or signe-in using Google account...</li> 
                    <li>It will create a library automatically</li>
                    <li>You need to fill library information</li> 
                    <li>Go to "About" section</li> 
                    <li>Click the "Edit" icon(pencil shape)</li>
                    <li>Fill in the form and save</li>
                  </ul>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs12 md4>
                <v-card-text class="text-xs-center blue-grey darken-2">
                  <v-icon x-large class="blue--text text--lighten-2">how_to_reg</v-icon>
                </v-card-text>
                <v-card class="blue-grey darken-2">
                  <v-card-title secondary-title>
                    <div class="headline text-xs-center orange--text">II. Update Your Profile</div>
                  </v-card-title>
                  <v-card-text class="white--text">
                    <ul>
                      <li>To update your profile information</li> 
                      <li>Click the "Profile" menu on the top menu bar</li> 
                      <li>Go to the "My Profile" section in the page</li> 
                      <li>Click the "Edit" icon(pencil shape)</li>
                      <li>Then "Profile Settings" form will be appeared</li>
                      <li>Fill in the form and save</li>
                    </ul>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs12 md4>
              <v-card-text class="text-xs-center blue-grey darken-2">
                  <v-icon x-large class="blue--text text--lighten-2">color_lens</v-icon>
                </v-card-text>
                <v-card class="blue-grey darken-2">
                  <v-card-title secondary-title>
                    <div class="headline text-xs-center orange--text">III. Create Topic Map</div>
                  </v-card-title>
                  <v-card-text class="white--text">
                    <ul>
                      <li>Go to "Latest Topic Maps" section in "Home"</li>
                      <li>Click the "Map Control" icon</li> 
                      <li>Click the blue button "CREATE TOPIC MAP"</li>
                      <li>Fill in the form and save</li>
                      <li>Click the topic title panel you've just created</li>
                      <li>The panel will show topic map information</li>
                    </ul>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs12 md4>
              <v-card-text class="text-xs-center blue-grey darken-2">
                  <v-icon x-large class="blue--text text--lighten-2">bubble_chart</v-icon>
                </v-card-text>
                <v-card class="blue-grey darken-2">
                  <v-card-title secondary-title>
                    <div class="headline text-xs-center orange--text">IV. Build & Edit Topic Map</div>
                  </v-card-title>
                  <v-card-text class="white--text">
                    <ul>
                      <li>Go to "Latest Topic Maps" section in "Home"</li>
                      <li>Click "Map Control" icon on this section </li>
                      <li>Click the topic title you want to edit</li> 
                      <li>Click "VIEW TOPIC MAP" button</li>
                      <li>Right click on the spot of topic map GUI to edit</li>
                      <li>Use TreeList GUI to edit category structure</li>
                    </ul>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs12 md4>
                <v-card-text class="text-xs-center blue-grey darken-2">
                  <v-icon x-large class="blue--text text--lighten-2">group_add</v-icon>
                </v-card-text>
                <v-card class="blue-grey darken-2">
                  <v-card-title secondary-title class="orange--text">
                    <div class="headline">V. Collaborate With Friends</div>
                  </v-card-title>
                  <v-card-text class="white--text">
                    <ul>
                      <li>Go to "Our Team" section in "Home"</li>
                      <li>Click the "Invite Team Member" icon</li>
                      <li>Fill friend's email in the form and send it</li>
                      <li>The friend will get invitation</li>
                      <li>You will get notification about acceptance</li>
                      <li>You can create topic map with friends</li>
                    </ul>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs12 md4>
                <v-card-text class="text-xs-center blue-grey darken-2">
                  <v-icon x-large class="blue--text text--lighten-2">hdr_weak</v-icon>
                </v-card-text>
                <v-card class="blue-grey darken-2">
                  <v-card-title secondary-title class="orange--text">
                    <div class="headline text-xs-center">VI. Share via Iframe Link</div>
                  </v-card-title>
                  <v-card-text class="white--text">
                    <ul>
                      <li>Go to "Latest Topic Maps" section in "Home"</li>
                      <li>Click "Map Control" icon on this section</li>
                      <li>Click the topic map title you want to link</li>
                      <li>Click "VIEW TOPIC MAP" button in the panel</li>
                      <li>Click "Ripple" icon on GUI and copy iframe link</li>
                      <li>Attch it to the web page you want to show it up</li>
                    </ul>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </section>
    <section id="home-bottom">
      <v-container height="500px">
        <v-layout column align-center justify-center>
          <div class="headline white--text mb-3">
            Subject Guide Has Never Been Easier
          </div>
          <em class="orange--text">The best platform for the resource based learning</em>
          <v-btn 
            class="blue lighten-2 mt-5 mb-4"
            :to="'/signup'"
            dark
            large
          >Get Started</v-btn>
        </v-layout>
      </v-container>
    </section>
    <v-footer
      dark
      height="auto"
    >
      <v-card
        flat
        tile
        class="blue-grey darken-3 white--text text-xs-center"
      >
        <v-card-text>
          <v-btn
            v-for="icon in icons"
            :key="icon"
            class="mx-3 white--text"
            icon
          >
            <v-icon size="24px">{{ icon }}</v-icon>
          </v-btn>
        </v-card-text>
        <v-card-text class="white--text pt-0">
          Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit amet. 
          Mauris cursus commodo interdum. Praesent ut risus eget metus luctus 
          accumsan id ultrices nunc. Sed at orci sed massa consectetur dignissim 
          a sit amet dui. Duis commodo vitae velit et faucibus. Morbi vehicula 
          lacinia malesuada. Nulla placerat augue vel ipsum ultrices, cursus 
          iaculis dui sollicitudin. Vestibulum eu ipsum vel diam elementum tempor 
          vel ut orci. Orci varius natoque penatibus et magnis dis parturient
          montes, nascetur ridiculus mus.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text class="white--text">
          &copy;2018 — <strong>Ripplesoft Limited</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        icons: [
          'fab fa-facebook',
          'fab fa-twitter',
          'fab fa-google-plus',
          'fab fa-linkedin',
          'fab fa-instagram'
        ]
      }
    }
  }
</script>       

<style scoped>
  #particles-js {
    height: 400px;
  }
  #home-bottom {
    background: grey-blue lighten 2;
  }
  .content {
    background: grey-blue lighten 2;
  }
</style>
