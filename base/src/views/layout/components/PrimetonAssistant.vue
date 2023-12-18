<template>
  <span>
    <el-tooltip content="智能助手" placement="top" v-if="isAI">
      <el-button :type="btnType" @click="showDrawer">
        <svg-icon
          icon-class="AI-assistant"
          style="height:18px;width:18px;margin-bottom: -3px;color:#000"
        />
      </el-button>
    </el-tooltip>
    <el-drawer
      class="pm-assistant"
      title="Primeton智能开发助手"
      :visible.sync="drawerVisible"
      :direction="drawerDirection"
      size="60%"
    >
      <el-tooltip content="清除聊天历史">
        <el-button
          v-if="chatHistory.length>0"
          icon="el-icon-delete"
          type="text"
          class="tool-btn"
          @click="clearChatHistory"
        />
      </el-tooltip>
      <div class="pl-20 pr-20" style="height: 100%">
        <div class="assist-talk-content">
          <div v-if="chatHistory.length===0">
            <p>请输入您的问题，描述越准确，答案越靠谱哦</p>
            <el-card
              v-for="(q,index) in exampleQuestion"
              :key="index"
              :body-style="{ padding: 0 }"
              shadow="hover"
              class="mt-10 demo-question"
            >
              <div class="exp-card-body" @click="askExampleQuestion(q)">
                <span>{{ q }}</span>
              </div>
            </el-card>
          </div>
          <div v-else>
            <div v-for="(item,index) in chatHistory" :key="item.id">
              <div class="question">
                <div class="question-box">{{ item.question }}</div>
              </div>
              <div class="answer-box">
                <i v-if="loading" class="el-icon-loading" />
                <pre v-else-if="item.editorType==='normal'" class="chat-history-answer">{{ item.loading?(typingAnswer.loadingAnswer||'')+'...':item.answer }}</pre>
                <MarkdownEditor
                  v-else-if="item.editorType==='markdown'"
                  class="chat-history-answer"
                  :content="item.loading?typingAnswer.loadingAnswer+'...':item.asnwer"
                />
                <span v-if="!item.loading" class="answer-tool">
                  <el-tooltip content="复制">
                    <el-button type="text" @click="copy">
                      <i class="el-icon-copy-document " :copy-index="index" />
                    </el-button>
                  </el-tooltip>
                  <!--                  <el-tooltip content="填进表单">-->
                  <!--                    <el-button icon="el-icon-edit-outline" type="text" @click="fillBack(item.answer)" />-->
                  <!--                  </el-tooltip>-->
                </span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div style="display: grid">
            <el-input
              v-model="chatForm.question"
              type="textarea"
              placeholder="Enter提交问题，Shift+Enter换行"
              @focus="questionOnFocus"
              @keypress.native.enter="handlerEnter"
            />
            <el-button
              class="send-question-btn"
              :loading="loading||typingAnswer.loadingAnswer"
              type="primary"
              :disabled="!chatForm.question"
              @click="createContent(chatForm.question)"
            >
              {{ (loading||typingAnswer.loadingAnswer)?'小助手努力作答ing':'提问' }}</el-button>
          </div>
        </div>
      </div>
    </el-drawer>
  </span>
</template>

<script>
import { BaseVue } from '@lib'
import { RdcloudConversationController } from '@controller'
import MarkdownEditor from 'markdown-it-vue'
import Clipboard from 'clipboard'
import _ from 'lodash'
import 'highlight.js'
import 'highlight.js/styles/a11y-dark.css'

const MessagesList = [{ role: 'system', content: 'You are a helpful assistant.' }]
const summer = [{ question: 'summer', editorType: 'normal', answer: 'VuePress和Gitbook都是用来编写文档的工具，但它们的设计思路和使用方式略有不同。\n\nVuePress是一个由Vue.js驱动的静态网站生成器，也可以用来编写文档。VuePress将Vue.js作为基础框架，提供了丰富的Vue组件和开发工具，让用户可以轻松地创建高质量的文档站点。VuePress的优点是使用起来简单，易于定制和扩展，支持Markdown写作和代码高亮。\n\nGitbook是一个基于Git和Markdown的文档工具，也可以用来创建静态网站。Gitbook的设计思路是提供一个易于写作和组织文档的平台，并且支持多种输出格式（如PDF、EPUB等）。Gitbook的优点是支持多语言、多主题和多插件，可以实现定制化的文档输出。\n\n总的来说，VuePress更适合用来构建文档站点，Gitbook更适合用来编写和组织文档。具体选择哪个工具取决于你的需求和个人喜好。' }]
export default {
  name: 'primeton-assistant',
  components: { MarkdownEditor },
  mixins: [BaseVue],
  props: {
    exampleQuestion: {
      default: () => [],
      type: Array,
    },
    btnType: {
      default: 'text',
    },
    drawerDirection: {
      default: 'rtl',
    },
    questionPrefix: {
      default: '',
      type: String,
    },
    addPrefixOnlyFirstTime: {
      default: true
    },
    value: {}
  },
  data() {
    return {
      drawerVisible: false,
      chatHistory: [],
      messagesList: _.cloneDeep(MessagesList),
      chatForm: {
        question: null
      },
      chatKey: new Date(),
      loading: false,
      typingAnswer: {
        answer: null,
        loadingAnswer: null,
        currentPosition: 0,
        timeOutFlat: null
      }
    }
  },
  computed: {
    isAI() {
      return Vue.config.isAI || false
    },
  },
  mounted() {
    this.chatHistory = []
    this.messagesList = _.cloneDeep(MessagesList)
  },
  methods: {
    copy(e) {
      let formatterAnswer = window.getSelection().toString()
      if (!formatterAnswer) {
        formatterAnswer = this.chatHistory[e.target.getAttribute('copy-index')].answer
      }
      const clipboard = new Clipboard(e.target, {
        text: () => formatterAnswer
      })
      clipboard.on('success', () => {
        this.$message({
          message: '复制成功',
          type: 'success',
          duration: 1000
        })
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        clipboard.destroy()
      })
    },
    questionOnFocus() {
      if (this.questionPrefix && this.chatHistory.length === 0 && !this.chatForm.question && this.addPrefixOnlyFirstTime) {
        this.chatForm.question = this.questionPrefix
      }
    },
    fillBack(answer) {
      const formatterAnswer = answer ? answer.replace(/^(.|\n)*(```).*(\n)/, '').replace(/(```).*/g, '') : answer
      this.$emit('input', formatterAnswer)
      this.$emit('changeValue', formatterAnswer)
    },
    showDrawer() {
      this.drawerVisible = true
    },
    askExampleQuestion(question) {
      this.chatForm.question = question
    },
    clearChatHistory() {
      this.$confirm('确定要删除和小助手的谈话记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.chatHistory = []
        this.messagesList = _.cloneDeep(MessagesList)
      })
    },
    loadAnswer() {
      if (this.typingAnswer.timeOutFlat) {
        this.typingAnswer.timeOutFlat = setTimeout(() => {
          if (this.typingAnswer.currentPosition <= this.typingAnswer.answer.length) {
            this.typingAnswer.loadingAnswer += this.typingAnswer.answer[this.typingAnswer.currentPosition]
            this.typingAnswer.currentPosition++
            this.loadAnswer()
          } else {
            this.typingAnswer.answer = null
            this.typingAnswer.loadingAnswer = null
            this.typingAnswer.currentPosition = 0
            this.chatHistory[this.chatHistory.length - 1].loading = false
            this.loading = false
          }
        }, 20)
      }
    },
    getMessage(question) {
      const result = [{ role: 'system', content: 'You are a helpful assistant.' }]
      this.chatHistory.forEach(item => {
        result.push({
          role: 'user',
          content: item.question,
        })
        result.push({
          role: 'assistant',
          content: item.answer,
        })
      })
      result.push({
        role: 'user',
        content: question,
      })
      return result
    },
    handlerEnter(e) {
      if (!e.shiftKey) {
        e.stopPropagation()
        e.preventDefault()
        this.createContent()
      }
    },
    async createContent(question = this.chatForm.question) {
      this.loading = true
      this.messagesList.push({
        role: 'user',
        content: question,
      })
      this.chatHistory.push({
        question: question,
        answer: null,
        loading: true,
        editorType: 'normal'
      })
      this.chatForm.question = null
      const resp = await this.dispatch(RdcloudConversationController.createContent, {
        conversationId: null,
        lastTime: '2023-07-17 10:28:49',
        rdConversationContent: {
          content: question,
          rdcloudConversation: {
            id: null,
            gptModel: 'gpt-35-turbo'
          }
        },
        contents: this.messagesList
      })
      if (!resp.error) {
        const answer = _.get(resp, 'data.answer.content', null)
        this.messagesList.push({
          role: 'assistant',
          content: answer,
        })
        this.chatHistory[this.chatHistory.length - 1] = {
          question: question,
          answer: answer,
          loading: true,
          editorType: answer.includes('```') ? 'markdown' : 'normal'
        }
        this.typingAnswer.answer = answer
        this.typingAnswer.loadingAnswer = ''
        this.typingAnswer.currentPosition = 0
        this.typingAnswer.timeOutFlat = 'begin'
        this.loadAnswer()
        this.chatForm.question = null
      }
      this.loading = false
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .pm-assistant .el-drawer__header {
  display: flex;
}
.tool-btn{
  position: absolute;
  top: 50px;
  left: 20px;
}
.assist-talk-content{
  height: calc(100% - 100px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 4px;
  .demo-question{
    white-space: break-spaces;
  }
  .exp-card-body{
    position: relative;
    padding-left: 9px;
    padding-right: 4px;
  }
  .question{
    text-align: right;
    white-space: break-spaces;
    .question-box{
      text-align: left;
      background-color: #007acc;
      color: white;
      font-weight: bolder;
      padding-left: 9px;
      padding-right: 9px;
      border-radius: 3px;
      position: relative;
      margin-right: 4px;
      margin-top: 5px;
      display: inline-block;
      line-height: 34px;
    }
    .question-box:after{
      position: absolute;
      top: 4px;
      right: -8px;
      content: '';
      border: 4px solid transparent;
      border-left-color:  #007acc;
    }
  }
  .answer-box{
    white-space: break-spaces;
    background-color: #f3f3f3;
    font-weight: bolder;
    border-radius: 3px;
    position: relative;
    margin-left: 4px;
    margin-top: 5px;
    display: inline-block;
    padding-right: 17px;
    padding-left: 9px;
    line-height: 34px;
    pre{
      line-height: 34px;
      margin: 0;
    }
    .answer-tool{
      padding: 0;
      float: right;
      margin-top: -16px;
      margin-right: -15px;
    }
  }
  ::v-deep .answer-box p,
  ::v-deep .answer-box pre.hljs{
    margin: 0;
  }
  .answer-box:before{
    position: absolute;
    top: 4px;
    left: -8px;
    content: '';
    border: 4px solid transparent;
    border-right-color:  #f3f3f3;
  }
  .chat-history-answer{
    max-width: 410px;
    white-space: break-spaces;
    ::v-deep pre{
      white-space: break-spaces;
      overflow: auto;
    }
  }
}
.error-box{
  text-align: center;
  background-color: #fef0f0;
  color: #f56c6c;
  font-weight: bolder;
  padding: 5px;
  border: 1px solid;
  border-radius: 3px;
  margin-bottom: 5px;
}
.send-question-btn{
  width: 100%;
  margin-top: 10px;
}
</style>

