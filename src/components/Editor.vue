<template>
  <div>
    <button @click="test">test</button>
    <div id="ixbrlTagOptionsBar" v-show="isIxbrlTagOptionsBarVisible" ref="optionsBar">
      <div class="ixbrlTagOption" @click="handleByOptions(0)">
        delete ixbrlTag
      </div>
    </div>
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
      editor: null as any,
      isIxbrlTagOptionsBarVisible: false,
      optionsHandle: [(span: any) => {
        const textNode = document.createTextNode(span.textContent);
        span.parentNode.replaceChild(textNode, span);
      }],
    }
  },
  methods: {
    onChange(e: any) {
      // this.$emit('changeContent', this.content)
      console.log('change')
    },
    handleFileSelect(e: any) {//发请求给后端
      const file = e.target.files[0]
      console.log(file)
    },
    handleFileSelect2(e: any) {//将传入的html文件解析到iframe中
      const file = e.target.files[0]
      const iframe = this.editor.iframeElement
      const reader = new FileReader();
      reader.onload = function () {
        const fileContent:any = reader.result;
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        //改body属性再导入iframe
        const parser = new DOMParser();
        const htmlDoc:any = parser.parseFromString(fileContent, 'text/html');
        htmlDoc.body.contentEditable=true
        iframeDocument.documentElement.innerHTML = htmlDoc.querySelector('html').outerHTML;
      };
      reader.readAsText(file);
    },
    handleByOptions(num: number) {
      this.optionsHandle[num](this.editor.selection.getEnd())
      this.isIxbrlTagOptionsBarVisible = false
    },
    test() {
      // console.log(this.editor.iframeElement)
      const iframe = this.editor.iframeElement
      console.log(iframe)
      // console.log(iframe.parent.pageXOffset, iframe.parent.pageYOffset)
      return
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document
      const htmlContent = iframeDocument.documentElement.outerHTML;
      console.log(htmlContent)
    }
  },
  mounted() {
    // const iframe = this.editor.iframeElement
    // const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    // iframeDocument.addEventListener('click', function(e:any) {
    //   if(_this.isIxbrlTagOptionsBarVisible){
    //     _this.isIxbrlTagOptionsBarVisible=false
    //   }
    // });
    window.addEventListener('click',(e:any)=>{
      if(this.isIxbrlTagOptionsBarVisible){
        this.isIxbrlTagOptionsBarVisible=false
      }
    })
  },
  created() {
    const _this: any = this
    this.init = {
      height: 800,
      toolbar: 'undo redo | markIxbrlTag | test',
      menu: {//自定义菜单
        my1: {title: 'File', items: 'importDocx importHtml export'}
      },
      menubar: 'my1',
      setup: (editor: any) => {
        _this.editor = editor
        // console.log(editor)
        // console.log(editor.iframeElement)
        editor.ui.registry.addButton('markIxbrlTag', {
          text: 'MarkIxbrl',
          // icon: "horizontal-rule",//显示在编辑器上的icon
          onAction: function (_: any) {
            const selectedText = editor.selection.getContent({format: 'text'})
            editor.selection.setContent(`<span style="background: yellow" class="ixbrlTag">${selectedText}</span>`)
            // console.log(editor.selection.getEnd())
            let node = editor.selection.getEnd()
            let bar: any = _this.$refs.optionsBar
            const iframe = _this.editor.iframeElement
            node.addEventListener('click', (e: any) => {
              // 阻止事件冒泡
              e.stopPropagation();
              var iframeRect = iframe.getBoundingClientRect();
              // console.log(e.x + iframeRect.left)
              // console.log(e.y + iframeRect.top)
              // console.log(e.x, e.y)
              bar.style.left = e.x + iframeRect.left + 5 + 'px'
              bar.style.top = e.y + iframeRect.top + 5 + 'px'
              _this.isIxbrlTagOptionsBarVisible = true
            })
          },
        });
        editor.ui.registry.addButton('test', {
          text: 'test',
          // icon: "horizontal-rule",//显示在编辑器上的icon
          onAction: function (_: any) {
            const selectedText = editor.selection.getContent({format: 'text'})
            console.log(editor.selection.getContent({format: 'text'}))//文本
            console.log(editor.selection.getEnd())//尾部所在node
            console.log(editor.selection.getNode())//选区共同祖先
            console.log(editor.selection.getRng())//选区
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
            const iframe = editor.iframeElement
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document
            const htmlContent = iframeDocument.documentElement.outerHTML;
            const fileData = new Blob([htmlContent], {type: 'text/html'});
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

#ixbrlTagOptionsBar {
  position: fixed;
  box-shadow: rgb(0 0 0 / 40%) 1px 2px 5px;
  font-family: "Segoe UI", Calibri, Thonburi, Arial, Verdana, sans-serif, "Mongolian Baiti", "Microsoft Yi Baiti", "Javanese Text";
  font-size: 12px;
  background: white;
  /*border: 1px solid #c6c6c6;*/
  color: #444444;
  cursor: default;
  min-width: 150px;
  z-index: 99;
}

.ixbrlTagOption {
  /*width: 100%;*/
  height: 12px;
  padding: 2px;
  text-align: center;
  line-height: 12px;
  /*background-color: aqua;*/
  /*cursor: pointer;*/
  border: 1px solid transparent;
  background-image: none;
  font-weight: normal;
  border-radius: 0;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
}

.ixbrlTagOption:hover {
  font-weight: normal;
  text-shadow: none;
  background: #B4B4B4;
}
</style>
