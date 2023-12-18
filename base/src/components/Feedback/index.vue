<template>
  <div class="feedback-wrapper">
    <transition
      name="btn-transition"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <div v-if="!feedbackDialogVisible" class="feedback" @click="feedbackDialogVisible = true">
        <span class="label">一键反馈</span>
        <svg-icon class="icon" icon-class="feedback" />
      </div>
    </transition>
    <transition
      name="dialog-transition"
      enter-active-class="animated bounceInRight faster"
      leave-active-class="animated bounceOutRight faster"
    >
      <div v-if="feedbackDialogVisible" class="feedback-dialog">
        <i class="el-icon-error icon-close" @click="feedbackDialogVisible = false" />
        <div class="feedback-form">
          <p class="title">反馈</p>
          <el-form ref="feedbackForm" :model="model" :rules="rules" class="form">
            <el-form-item label="" prop="type" :label-width="0">
              <!-- <span class="type-radio" @click="typeChage(item.id)">{{item.label}}</span> -->
              <el-radio-group v-model="model.typeRadio">
                <el-radio v-for="item in types" :key="item.id" :label="item.id">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="" prop="advice" :label-width="0">
              <el-input
                v-focus
                v-model="model.advice"
                type="textarea"
                resize="none"
                placeholder="请留下您的宝贵建议，谢谢！"
                :autosize="{ minRows: 3, maxRows: 3}"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="" prop="" :label-width="0" style="height: 77px; margin: 20px 0 0 0;">
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                multiple
                :limit="3"
                :on-exceed="ongExceed"
                :file-list="model.fileList"
                :on-success="handleSuccess"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
              >
                <i class="el-icon-plus" />
              </el-upload>
              <el-dialog :visible.sync="dialogVisible" append-to-body width="550px">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
            <el-form-item label="邮箱(选填)" prop="email" :label-width="labelWidth">
              <el-input v-model="model.email" placeholder="以便我们给您回复" />
            </el-form-item>
            <el-form-item label="其他(选填)" prop="others" :label-width="labelWidth">
              <el-input v-model="model.others" placeholder="手机或者QQ，微信，方便我们联系您" />
            </el-form-item>
          </el-form>
          <div class="feedback-btn-row">
            <el-button type="primary" size="mini" @click="submit">提交</el-button>
            <el-button size="mini" @click="cancel">取消</el-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'feedback',
  components: {},
  props: {},
  data() {
    return {
      labelWidth: '5rem',
      feedbackDialogVisible: false,
      model: {
        advice: '',
        typeRadio: '0',
        email: '',
        others: '',
        fileList: [
          // {
          //   name: 'food.jpeg',
          //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          // }, {
          //   name: 'food2.jpeg',
          //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          // }
        ]
      },
      rules: {
        advice: [{ required: true, message: '请输入您的宝贵建议！', trigger: 'blur' }]
      },
      types: [{
        id: '0',
        label: '功能'
      }, {
        id: '1',
        label: '数据'
      }, {
        id: '2',
        label: '其他'
      }],
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  computed: {
    fileList() {
      return this.model.fileList
    }
  },
  watch: {
    fileList: {
      handler: function(list) {
        console.log('🚀 ~ 🚀 ~ 🚀 ~ 🚀 ~ 🚀 ~ 🚀 ~ 🚀 ~ 🚀', list)
        if (list.length >= 3) {
          document.getElementsByClassName('el-upload')[0].style.opacity = 0
          document.getElementsByClassName('el-upload')[0].style['pointer-events'] = 'none'
        } else {
          console.log('******************')
          document.getElementsByClassName('el-upload')[0].style.opacity = 1
          document.getElementsByClassName('el-upload')[0].style['pointer-events'] = 'auto'
        }
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    // showFeedbackDialog() {
    //   this.feedbackDialogVisible = true
    // }
    handleSuccess(res, file) {
      this.model.fileList.push()
      //  if (res.errCode == 200) {
      this.model.fileList.push(file)
      // } else {
      //   this.$msg.error('上传图片失败!');
      // }
    },
    handleRemove(file, fileList) {
      this.model.fileList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    ongExceed() {
      // 上传数量超出
      this.$notify({
        title: '警告',
        message: '最多只能上传三张图片哦',
        type: 'warning'
      })
    },
    submit() {
      this.$refs['feedbackForm'].validate(async valid => {
        console.log('🚀 ~ file: index.vue ~ line 158 ~ submit ~ valid', valid)
        if (valid) {
          this.$refs['feedbackForm'].resetFields()
          this.feedbackDialogVisible = false

          this.$notify({
            title: '成功',
            message: '您的反馈已收到,感谢您的关注与支持!',
            type: 'success'
          })
        }
      })
    },
    cancel() {
      this.$refs['feedbackForm'].resetFields()
      this.feedbackDialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .feedback-wrapper {

    .feedback {
      position: fixed;
      bottom: 30%;
      right: 0;
      width: 40px;
      padding-bottom: 5px;
      background-color: #0972FF;
      border-radius: 3px 0 0 3px;
      opacity: 0.96;
      transform: translateX(3px);
      transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
      ;
      cursor: pointer;
      z-index: 9999;

      &:hover {
        transform: translateX(0);
        box-shadow: 0 0 35px 2px rgba(0, 0, 0, .24);
        opacity: 1;
      }

      .label {
        display: flex;
        width: 100%;
        padding: 12px 14px 5px 12px;
        flex-direction: column;
        align-items: flex-start;
        font-size: 14px;
        font-weight: 500;
        color: #fff;
        line-height: 1.3;
        user-select: none;
      }

      .icon {
        width: 40px;
        height: 28px;
        color: #fff;
      }
    }

    .feedback-dialog {
      position: fixed;
      bottom: 20%;
      right: 32px;
      width: 350px;
      // height: 230px;
      background-color: #fff;
      box-shadow: rgba(0, 0, 0, .35) 0 6px 100px 0;

      .icon-close {
        position: absolute;
        top: -13px;
        right: 20px;
        font-size: 27px;
        border-radius: 50%;
        border-bottom-style: none;
        border-width: 0;
        color: #0972FF !important;
        cursor: pointer;
        background-color: #fff;
        // transition: transform .3s;

        // &:hover {
        //   transform: rotate(-180deg);
        // }
      }

      .feedback-form {

        .title {
          width: 100%;
          margin: 0;
          padding: 0 10px;
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          line-height: 30px;
          background-color: #0972FF;
        }

        .form {
          padding: 10px;

          >>> .el-radio {
            margin-right: 25px !important;
          }

          >>> .el-form-item--mini.el-form-item {
            margin-bottom: 10px;
          }

          >>> .el-upload-list--picture-card .el-upload-list__item,
          >>> .el-upload--picture-card {
            width: 60px;
            height: 60px;
            line-height: 60px;

            i {
              font-size: 20px;
            }

            .el-upload-list__item-actions span+span {
              margin-left: 0;
            }

            .el-upload-list__item-actions {
              font-size: 16px;
              line-height: 1;

              i {
                font-size: 16px;
                line-height: 1;
                margin: 0 4px;
              }
            }

            .el-upload-list__item-status-label {
              right: -11px;
              top: -5px;
              width: 33px;
              height: 20px;

              i {
                vertical-align: top;
                margin-top: 8px;
                font-size: 12px;
              }
            }

            .el-icon-close,
            .el-icon-close-tip {
              display: none;
              font-size: 12px;
            }

          }

          // >>> .el-upload-list--picture-card .el-upload-list__item-actions span+span {
          //   margin-left: 0;
          // }
          >>> .el-input input::placeholder {
            font-size: 12px;
          }

          // >>> .el-upload-list--picture-card .el-upload-list__item-status-label{
          //   right: -11px;
          //   top: -5px;
          //   width: 33px;
          //   height: 20px;

          //   i {
          //     vertical-align: top;
          //     margin-top: 8px;
          //     font-size: 12px;
          //   }
          // }
        }

        .feedback-btn-row {
          padding-bottom: 10px;
          text-align: center;

          >>> .el-button+.el-button {
            margin-left: 60px;
          }
        }
      }
    }
  }
</style>
