<template>
  <div id="app">
    <router-link to="/calendar">日历</router-link>
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    name: 'app',
    data () {
      return {}
    },
    components: {},
    methods: {}
  }
</script>
<style>
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    padding: 0;
    line-height: 1.5;
  }
  #app {
    width: 80%;
    margin: 0 auto;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
