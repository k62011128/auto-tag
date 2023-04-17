<template>
  <div :style="{ width: width, height: height }" class="ixbrl-editor-wrapper">
    <div class="ixbrl-editor-header-wrapper">
      <input type="file" ref="fileInput" @change="handleFileSelect" accept=".docx"/>
      <button @click="importDocx">导入</button>
      <button @click="exportDocx">导出</button>
      <button @click="markIxbrl">markIxbrl</button>
    </div>
    <div v-html="html" ref="editor" id="doc-input" contenteditable="true" @input="handleInput"></div>
    <!--    <div v-html="html" ref="editor" id="doc-input" @input="handleInput"></div>-->
    <div id="ixbrlTagOptionsBar" v-show="isIxbrlTagOptionsBarVisible" ref="optionsBar">
      <div class="ixbrlTagOption" @click="handleByOptions(0)">
        delete ixbrlTag
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FileSaver from 'file-saver'
import mammoth, {convertToHtml} from "mammoth";
// @ts-ignore
import htmlDocx from 'html-docx-js/dist/html-docx'
import * as docx from 'docx-preview'
import {getCursorPosition, setCursorPosition, setIxbrlTag, getNextTextNode, getTextNodes, HtmlTag} from "@/utils/tools";
import Docxtemplater from 'docxtemplater';
// import JSZipUtils from 'jszip-utils';
import JSZip from 'jszip';

export default Vue.extend({
  name: 'HelloWorld',
  props: {
    width: String,
    height: String
  }
  ,
  mounted() {
    this.$nextTick(() => {
      let bar: any = this.$refs.optionsBar
      if (bar?.contains)
        window.addEventListener('click', (e) => {
          if (!bar.contains(e.target))
            this.isIxbrlTagOptionsBarVisible = false
        })
    });
  }
  ,
  data() {
    return {
      html: null as string | null,
      editedHtml: null as string | null,
      isIxbrlTagOptionsBarVisible: false,
      ixbrlTag: null as any,
      optionsHandle: [(span: any) => {
        const textNode = document.createTextNode(span.textContent);
        span.parentNode.replaceChild(textNode, span);
      }],
      currentDocument:null as any
    };
  },
  methods: {
    handleFileSelect(e: any) {
      const file = e.target.files[0]
      this.currentDocument = file;
    },
    importDocx(){
      const _this: any = this
      let reader = new FileReader()
      reader.readAsArrayBuffer(this.currentDocument)
      reader.onload = function (evt: any) {
        let arrayBuffer = evt.target.result
        mammoth.convertToHtml({arrayBuffer: arrayBuffer}).then(_this.displayResult, function (error) {
          console.log('error',error);
        }).then(_this.setEventListener)
      }
      // return
      // const docxOptions = Object.assign(docx.defaultOptions, {
      //   className: "docx", //class name/prefix for default and document style classes
      //   inWrapper: true, //enables rendering of wrapper around document content
      //   ignoreWidth:  false, //disables rendering width of page
      //   ignoreHeight:  false, //disables rendering height of page
      //   ignoreFonts: false, //disables fonts rendering
      //   breakPages: true, //enables page breaking on page breaks
      //   ignoreLastRenderedPageBreak:  true, //disables page breaking on lastRenderedPageBreak elements
      //   experimental: false, //enables experimental features (tab stops calculation)
      //   trimXmlDeclaration: true, //if true, xml declaration will be removed from xml documents before parsing
      //   useBase64URL: false, //if true, images, fonts, etc. will be converted to base 64 URL, otherwise URL.createObjectURL is used
      //   useMathMLPolyfill: false, //includes MathML polyfills for chrome, edge, etc.
      //   showChanges: false, //enables experimental rendering of document changes (inserions/deletions)
      //   debug:  true, //enables additional logging
      // });
      // const container:any = document.querySelector("#doc-input");
      // if(!this.currentDocument)
      //   return
      // docx.renderAsync(this.currentDocument, container,undefined,docxOptions)
      //     .then((x) => {
      //       // renderThumbnails(container, document.querySelector("#thumbnails-container"));
      //       console.log('ok');
      //       this.displayResult()
      //     }).then(_this.setEventListener);
    },
    displayResult(result:any): any {
      // return
      // let _this=this
      // let bar:any=this.$refs.optionsBar
      let htmlString = result.value
      // console.log(document.querySelector('#doc-input'))
      // console.log(htmlString)
      if(!htmlString)
        return
      // console.log(typeof htmlString)//string
      // return
      // console.log(htmlValue)
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(htmlString, 'text/html');
      let textNodes = getTextNodes(htmlDoc.body)
      // console.log(textNodes)
      textNodes.forEach((node: any) => {
        let str = node.textContent
        const reg = /(?<=\(\{\().*?(?=\)\}\)\(ixbrlTag\))/g
        let match = null
        let toDoArr: any = []
        while ((match = reg.exec(str)) !== null) {
          // console.log(match)
          // console.log(match.index)
          const startIndex = match.index;
          const length = match[0].length;
          // console.log(match[0])
          // console.log(`匹配到的位置：${startIndex}，匹配到的长度：${length}`);
          toDoArr.push({startIndex, length})
          reg.lastIndex = match.index + 1
        }
        for (let i = toDoArr.length - 1; i >= 0; i--) {
          // 创建一个 Range 对象
          const range = document.createRange();
          // 设置选中区域的起始点和结束点
          range.setStart(node, toDoArr[i].startIndex);
          range.setEnd(node, toDoArr[i].startIndex + toDoArr[i].length);
          // 将选中的文本包裹在<span>标签内
          const span = document.createElement('span');
          span.innerText = range.toString();
          span.style.backgroundColor = 'yellow'
          span.classList.add('ixbrlTag')
          // 将<span>标签插入到文本范围内
          range.deleteContents();
          range.insertNode(span);
        }
      })
      htmlString = htmlDoc.body.innerHTML
      htmlString = htmlString.replace(/\(\{\(/g, '')
      htmlString = htmlString.replace(/\)\}\)\(ixbrlTag\)/g, '')
      // console.log(htmlString)
      this.html = htmlString
    },
    setEventListener() {
      // return
      let _this = this
      let tags = document.querySelectorAll('span.ixbrlTag')
      let bar: any = this.$refs.optionsBar
      tags.forEach((item) => {
        item.addEventListener('click', (e: any) => {
          // 阻止事件冒泡
          e.stopPropagation();
          _this.ixbrlTag = item
          bar.style.left = e.pageX + 'px'
          bar.style.top = e.pageY + 'px'
          _this.isIxbrlTagOptionsBarVisible = true
        })
      })
    }
    ,
    handleInput(event: any) {

    },
    exportDocx() {
      let ed: any = this.$refs.editor
      let htmlString = ed.innerHTML
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(htmlString, 'text/html');
      let arr: any = htmlDoc.querySelectorAll('.ixbrlTag')
      arr.forEach((item: any) => {
        item.innerText = '({(' + item.innerText + ')})(ixbrlTag)'
        this.optionsHandle[0](item)
      })
      htmlString = htmlDoc.body.innerHTML
      // return
      const blob: any = htmlDocx.asBlob(htmlString);
      FileSaver.saveAs(blob, `新建文档.docx`)
    },
    markIxbrl() {
      let {startContainer, start, endContainer, end} = getCursorPosition();
      let _this = this
      let bar: any = this.$refs.optionsBar
      // console.log(startContainer, endContainer)
      if (startContainer === endContainer) {
        // console.log('markIxbrl')
        // 获取选中文本的范围
        const selection: any = window.getSelection();
        const range = selection.getRangeAt(0);
        // 将选中的文本包裹在<span>标签内
        const span = document.createElement('span');
        span.innerText = range.toString();
        span.style.backgroundColor = 'yellow'
        span.classList.add('ixbrlTag')
        span.addEventListener('click', (e: any) => {
          // 阻止事件冒泡
          e.stopPropagation();
          _this.ixbrlTag = span
          bar.style.left = e.pageX + 'px'
          bar.style.top = e.pageY + 'px'
          _this.isIxbrlTagOptionsBarVisible = true
        })
        // 将<span>标签插入到文本范围内
        range.deleteContents();
        range.insertNode(span);
      } else {
        let ns = startContainer
        // console.log(startContainer.nextSibling)
        let flag = 0;
        while (ns) {
          ns = ns.nextSibling
          if (ns === endContainer) {
            break
          }
          if (ns?.nodeType !== 3) {
            flag = 1
            break;
          }
        }
        if (!flag) {
          // 获取选中文本的范围
          const selection: any = window.getSelection();
          const range = selection.getRangeAt(0);
          // 将选中的文本包裹在<span>标签内
          const span = document.createElement('span');
          span.innerText = range.toString();
          span.style.backgroundColor = 'yellow'
          span.classList.add('ixbrlTag')
          span.addEventListener('click', (e: any) => {
            // 阻止事件冒泡
            e.stopPropagation();
            _this.ixbrlTag = span
            bar.style.left = e.pageX + 'px'
            bar.style.top = e.pageY + 'px'
            _this.isIxbrlTagOptionsBarVisible = true
          })
          // 将<span>标签插入到文本范围内
          range.deleteContents();
          range.insertNode(span);
        }
      }
    },
    handleByOptions(num: number) {
      this.optionsHandle[num](this.ixbrlTag)
      this.isIxbrlTagOptionsBarVisible = false
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.ixbrl-editor-wrapper {
  display: flex;
  flex-direction: column;
}
section.docx{
  margin: auto;
}
.ixbrl-editor-header-wrapper {
  width: 100%;
  height: auto;
}

#doc-input {
  display: block;
  width: 100%;
  height: auto;
  overflow: auto;
}

.ixbrlTag {
  cursor: pointer;
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
}

.ixbrlTagOption {
  /*width: 100%;*/
  height: 12px;
  padding: 2px;
  /*text-align: center;*/
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
