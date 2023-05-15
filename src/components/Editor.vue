<template>
  <div>
    <button @click="test">test</button>
    <Editor
        api-key="s5dxut3o71yf2okicziqqf6w0pwduc8fzrrwy7q9pqj1v7wh"
        v-model="content"
        ref="editor"
        @onChange="onChange"
        :init="init"
    >
    </Editor>
    <input type="file" ref="fileInput" @change="handleFileSelect" accept=".docx" v-show="false"/>
    <input type="file" ref="fileInput2" @change="handleFileSelect2" accept=".html" v-show="false"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Editor from '@tinymce/tinymce-vue'

export default Vue.extend({
  components: {Editor},
  data() {
    return {
      content: "",
      init: {},
      editor: null as any
    }
  },
  methods: {
    onChange(e: any) {
      this.$emit('changeContent', this.content)
    },
    handleFileSelect(e: any) {//发请求给后端
      const file = e.target.files[0]
      console.log(file)
    },
    handleFileSelect2(e: any) {//将传入的html文件解析到iframe中
      const file = e.target.files[0]
      const iframe=this.editor.iframeElement
      const reader = new FileReader();
      reader.onload = function() {
        const fileContent = reader.result;
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        iframeDocument.documentElement.innerHTML = fileContent;
      };
      reader.readAsText(file);
    },
    test(){
      // console.log(this.editor.iframeElement)
      const iframe=this.editor.iframeElement
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document
      const htmlContent = iframeDocument.documentElement.outerHTML;
      console.log(htmlContent)
    }
  },
  mounted() {

  },
  created() {
    const _this:any=this
    this.init = {
      height: 800,
      toolbar: 'undo redo | markIxbrlTag | test',
      menu: {//自定义菜单
        my1: {title: 'File', items: 'importDocx importHtml export'}
      },
      menubar: 'my1',
      setup: (editor: any) => {
        _this.editor=editor
        // console.log(editor)
        // console.log(editor.iframeElement)
        editor.ui.registry.addButton('markIxbrlTag', {
          text: 'MarkIxbrl',
          // icon: "horizontal-rule",//显示在编辑器上的icon
          onAction: function (_: any) {
            const selectedText = editor.selection.getContent({format: 'text'})
            editor.selection.setContent(`<span style="background: yellow">${selectedText}</span>`)
          },
        });
        editor.ui.registry.addButton('test', {
          text: 'test',
          // icon: "horizontal-rule",//显示在编辑器上的icon
          onAction: function (_: any) {
            const selectedText = editor.selection.getContent({format: 'text'})
            editor.selection.setContent(`<span style="background: yellow">${selectedText}</span>`)
          },
        });
        editor.ui.registry.addMenuItem('importDocx', {
          text: 'Import Docx',
          onAction: function () {
            _this.$refs.fileInput.click()
          }
        });
        editor.ui.registry.addMenuItem('importHtml', {
          text: 'Import Html',
          onAction: function () {
            _this.$refs.fileInput2.click()
          }
        });
        editor.ui.registry.addMenuItem('export', {//将iframe里的html导出
          text: 'Export Html',
          onAction: function () {
            const iframe=editor.iframeElement
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document
            const htmlContent = iframeDocument.documentElement.outerHTML;
            const fileData = new Blob([htmlContent], { type: 'text/html' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(fileData);
            downloadLink.download = 'download.html';
            downloadLink.click();
          }
        });
      },
    }
  }
})
</script>

<style scoped>
@media (min-width: 1024px) {
  #sample {
    display: flex;
    flex-direction: column;
    place-items: center;
    width: 1000px;
  }
}
</style>
