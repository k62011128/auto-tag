<template>
  <div id="app">
    <HelloWorld width="100%" height="500px"/>
<!--    <Editor></Editor>-->
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import Editor from "@/components/Editor.vue";
export default Vue.extend({
  name: 'App',
  components: {
    HelloWorld,
    Editor
  }
});
</script>

<style>

</style>
