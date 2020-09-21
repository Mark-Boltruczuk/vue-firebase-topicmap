<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 mt-4>
        <v-card>
          <v-card-title class="red lighten-1" dark>
            <span class="title white--text">Team Member Pending List</span>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex
        xs12
        sm4
        v-for="n in 6"
        :key="n"
      >
        <v-card class="blue-grey darken-1" dark>
          <v-card-title class="white--text">Name</v-card-title>
          <v-card-title class="white--text">Job Title</v-card-title>
          <v-card-text class="white--text">Email</v-card-text>
          <v-btn flat class="orange--text">Accept</v-btn>
          <v-btn flat class="info--text">Reject</v-btn>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
