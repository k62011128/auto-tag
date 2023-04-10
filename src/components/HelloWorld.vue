<template>
  <div :style="{ width: width, height: height }">
    <input type="file" ref="fileInput" @change="handleFileSelect" accept=".docx"/>
    <button @click="exportDocx">导出</button>
    <div v-html="html" ref="docContainer" id="doc-input" contenteditable="true" @input="handleInput"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import mammoth from 'mammoth';

export default Vue.extend({
  name: 'HelloWorld',
  props: {
    width:String,
    height:String
  },
  data(){
    return {
      html: null as string|null,
      editedHtml: null as string|null,
    };
  },
  methods: {
    handleFileSelect(e:any) {
      const _this:any = this
      const file = e.target.files[0]
      // console.log(file)
      // return
      let reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = function (evt:any) {
        let arrayBuffer = evt.target.result
        // console.log(arrayBuffer)
        mammoth.convertToHtml({ arrayBuffer: arrayBuffer }).then(_this.displayResult, function(error) {
          console.error(error);
        });

      }
    },

    displayResult(result:any):any{
      let htmlValue = result.value
      // this.$refs.docContainer=htmlValue
      this.html=htmlValue
    },
    handleInput(event:any) {
      this.html = event.target.innerHTML
    },
    exportDocx() {

    },
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#doc-input{
  display: block;
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
