<template>
  <div>
    <Editor
        api-key="s5dxut3o71yf2okicziqqf6w0pwduc8fzrrwy7q9pqj1v7wh"
        v-model="content"
        ref="editor"
        @onChange="onChange"
        :init="init"
    >
    </Editor>
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
    onChange(e:any) {
      this.$emit('changeContent', this.content)
    },
  },
  mounted() {

  },
  created() {
    const that:any = this;
    this.init = {
      height: 800,
      toolbar: 'undo redo | markIxbrlTag',
      menu: {//自定义菜单
        my1: {title: 'File', items: 'import export'}
      },
      menubar: 'my1',
      setup: (editor:any) => {
        // console.log(editor)
        // console.log(editor.iframeElement)
        editor.ui.registry.addButton('markIxbrlTag', {
          text: 'MarkIxbrl',
          // icon: "horizontal-rule",//显示在编辑器上的icon
          onAction: function (_:any) {
            const selectedText = editor.selection.getContent({ format: 'text' })
            editor.selection.setContent(`<span style="background: yellow">${selectedText}</span>`)
          },
        });
        editor.ui.registry.addMenuItem('import', {
          text: 'Import',
          onAction: function() {
              console.log('import')
          }
        });
        editor.ui.registry.addMenuItem('export', {
          text: 'Export',
          onAction: function() {

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
