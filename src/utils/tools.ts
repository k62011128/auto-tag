//html字符串类
class HtmlTag {
    value: string
    add: any

    constructor(tagName: any = null, attributes: any = {}, value: any = '') {
        if (tagName === null) {
            this.value = value
            this.add = (child: HtmlTag) => {
                if (this.value.length > 0) {
                    let op = '', ed = ''
                    for (let i = this.value.length - 1; i >= 0; i--) {
                        if (this.value[i] === '<') {
                            op = this.value.slice(0, i)
                            ed = this.value.slice(i, this.value.length)
                            break;
                        }
                    }
                    this.value = op + child.value + ed
                } else
                    this.value = child.value
            }
            return this
        }
        let res = '<' + tagName;
        for (let key in attributes) {
            res += ' ' + key + '=' + `'${attributes[key]}'`
        }
        res += '>' + value + '</' + tagName + '>'
        this.value = res
        this.add = (child: HtmlTag) => {
            if (this.value.length > 0) {
                let op = '', ed = ''
                for (let i = this.value.length - 1; i >= 0; i--) {
                    if (this.value[i] === '<') {
                        op = this.value.slice(0, i)
                        ed = this.value.slice(i, this.value.length)
                        break;
                    }
                }
                this.value = op + child.value + ed
            } else
                this.value = child.value
        }
        return this
    }
}

// 获取光标位置信息
function getCursorPosition(): any {
    const sel: any = window.getSelection();
    const range = sel.getRangeAt(0);
    const startContainer = range.startContainer;
    const start = range.startOffset;
    const endContainer = range.endContainer;
    const end = range.endOffset;
    return {startContainer, start, endContainer, end}
}

// 设置光标位置
function setCursorPosition(startContainer: any, startPos: number, endContainer?: any, endPos?: number): void {
    const range = document.createRange();
    range.setStart(startContainer, startPos);
    range.setEnd(endContainer ?? startContainer, endPos ?? startPos);
    const selection: any = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

// 获取当前选中的文本所在节点
function setIxbrlTag(): void {

}

//获取下一个文本节点
function getNextTextNode(node: any,textNodesArr:any): any {
    let nxtPos= textNodesArr.indexOf(node)+1
    if(nxtPos<textNodesArr.length){
        return textNodesArr[nxtPos]
    }
    return null
    // let parent = node?.parentNode
    // if (!parent) {//到顶了或者node不存在
    //     return null
    // }
    // let childNodes = parent.childNodes
    // const index = Array.prototype.indexOf.call(childNodes, node);
    // for (let i = index + 1; i < childNodes.length; i++) {
    //     let tmp = getFirstTextNode(childNodes[i])
    //     if (tmp) {
    //         return tmp
    //     }
    // }
    // return getNextTextNode(parent)
}

// //搜索当前node首个text节点
// function getFirstTextNode(node: any): any {
//     if (node?.nodeType === 3) {
//         return node
//     }
//     if (node?.nodeType === 1) {
//         let childNodes = node.childNodes
//         if (childNodes?.length) {
//             for (let i = 0; i < childNodes.length; i++) {
//                 let res = getFirstTextNode(childNodes[i])
//                 if (res?.nodeType === 3) {
//                     return res
//                 }
//             }
//         }
//     }
//     return null
// }

//获取所有的文本节点
function getTextNodes(node: any): any {
    let textNodes: any = [];
    if (node.nodeType === 3) {
        textNodes.push(node);
    } else {
        for (let childNode of node.childNodes) {
            textNodes.push(...getTextNodes(childNode)) ;
        }
    }
    return textNodes;
}

export {
    getCursorPosition,
    setCursorPosition,
    setIxbrlTag,
    getNextTextNode,
    HtmlTag,
    getTextNodes
}
