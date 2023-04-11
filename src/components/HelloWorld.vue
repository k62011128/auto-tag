<template>
  <div :style="{ width: width, height: height }">
    <input type="file" ref="fileInput" @change="handleFileSelect" accept=".docx"/>
    <button @click="exportDocx">导出</button>
    <button @click="test">test</button>
    <div v-html="html" ref="editor" id="doc-input" contenteditable="true" @input="handleInput"></div>
<!--    <div v-html="html" ref="editor" id="doc-input" @input="handleInput"></div>-->

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import mammoth from 'mammoth';
import FileSaver from 'file-saver'
// @ts-ignore
import htmlDocx from 'html-docx-js/dist/html-docx'
import {getCursorPosition,setCursorPosition,setIxbrlTag,getNextTextNode} from "@/utils/tools";
export default Vue.extend({
  name: 'HelloWorld',
  props: {
    width:String,
    height:String
  },
  mounted() {
    let editor:any=this.$refs.editor
    // editor.addEventListener('click', this.test);
    // editor?.addEventListener('input', () => {
    //   // 获取光标位置
    //   const cursorPosition = getCursorPosition(editor);
    //   // 将光标移动到正确的位置
    //   setCursorPosition(editor, cursorPosition);
    // });
  }
  ,
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
      // console.log(typeof htmlValue)//string
      // console.log(htmlValue)
      this.html=htmlValue
    },
    handleInput(event:any) {
      this.html = event.target.innerHTML
    },
    exportDocx() {
      // console.log('export')
      const html = this.html
      const blob:any = htmlDocx.asBlob(html);
      // console.log(blob)
      FileSaver.saveAs(blob, `新建文档.docx`)
    },
    test(){
      let {startContainer,start,endContainer,end}=getCursorPosition();
      // console.log(startContainer,start)
      // console.log(endContainer,end)
      // const selection:any = window.getSelection();
      // const range = selection.getRangeAt(0);
      // const index = range.startOffset;
      // console.log(index)
      setCursorPosition(startContainer,start)
      // console.log(typeof startContainer)//object
      console.log(getNextTextNode(startContainer))
      // console.log(startContainer.parentNode)
      // console.log(startContainer.parentNode.children)
      // console.log(startContainer.parentNode.childNodes)
      // console.log(startContainer.nextElementSibling)
      // const selection:any = window.getSelection();
      // const range = selection.getRangeAt(0);

      return
      // let editor:any=this.$refs.editor
      // const textToInsert = '要插入的文字';
      // const textBeforeCursor = editor.textContent.slice(0, index);
      // const textAfterCursor = editor.textContent.slice(index);
      // editor.textContent = textBeforeCursor + textToInsert + textAfterCursor;

    }
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
