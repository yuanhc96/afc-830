<template>
  <el-input v-bind="$attrs" v-model="value" @input="inputValue">
    <template slot="append">
      <el-popover
        placement="bottom"
        width="450"
        trigger="click">
        <div class="openPopover" slot="reference">
          <i class="el-icon-edit" style="color:var(--tagBg);"></i>
        </div>
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="秒" name="second"></el-tab-pane>
          <el-tab-pane label="分钟" name="minutes"></el-tab-pane>
          <el-tab-pane label="小时" name="hour"></el-tab-pane>
          <el-tab-pane label="日" name="day"></el-tab-pane>
          <el-tab-pane label="月" name="month"></el-tab-pane>
          <el-tab-pane label="周" name="week"></el-tab-pane>
          <el-tab-pane label="年" name="year"></el-tab-pane>
          <el-radio-group v-model="currentOptions.value" @input="changeCurrent">
            <el-col v-if="['year'].includes(activeName)" class="mt-10">
              <el-radio label="none">{{currentOptions.extra}}</el-radio>
            </el-col>
            <el-col v-if="currentOptions.one" class="mt-10">
              <el-radio label="*">{{currentOptions.one}}</el-radio>
            </el-col>
            <el-col v-if="['day', 'month', 'week'].includes(activeName)" class="mt-10">
              <el-radio label="noAppoint">不指定</el-radio>
            </el-col>
            <el-col class="mt-10">
              <el-radio label="cycle">
                周期 从
                <span  v-if="['week'].includes(activeName)">{{ currentOptions.label }}</span>
                <el-input v-model="currentOptions.cycle1" style="width: 40px;" @blur="blurInput('cycle')"/> - <el-input v-model="currentOptions.cycle2" style="width: 40px;" @blur="blurInput('cycle')" />
                <span v-if="!['week'].includes(activeName)">{{ currentOptions.label }}</span>
              </el-radio>
            </el-col>
            <el-col v-if="!['year', 'week'].includes(activeName)" class="mt-10">
              <el-radio label="once">
                从
                <el-input v-model="currentOptions.start" style="width: 35px;" @blur="blurInput('once')" />
                {{ currentOptions.label }}开始,每
                <el-input v-model="currentOptions.end" style="width: 35px;" @blur="blurInput('once')" />
                {{ currentOptions.label }}执行一次
              </el-radio>
            </el-col>
            <el-col v-else-if="['week'].includes(activeName)" class="mt-10">
              <el-radio label="once">
                第
                <el-input v-model="currentOptions.start" style="width: 35px;" @blur="blurInput('once')" />
                周的星期
                <el-input v-model="currentOptions.end" style="width: 35px;" @blur="blurInput('once')" />
              </el-radio>
            </el-col>
            <el-col v-if="['day'].includes(activeName)" class="mt-10">
              <el-radio label="weekday">
                每月
                <el-input v-model="currentOptions.extraValue" style="width: 35px;" @blur="blurInput('weekday')" />
                号最近的那个工作日
              </el-radio>
            </el-col>
            <el-col v-if="['day'].includes(activeName)" class="mt-10">
              <el-radio label="last">本月最后一天</el-radio>
            </el-col>
            <el-col v-if="['week'].includes(activeName)" class="mt-10">
              <el-radio label="last1">
                本月最后一个星期
                <el-input v-model="currentOptions.extraValue" style="width: 35px;" @blur="blurInput('last1')" />
              </el-radio>
            </el-col>
            <el-col v-if="activeName != 'year'" class="mt-10">
              <el-radio label="appoint" v-model="currentOptions.appoint">指定</el-radio>
              <el-checkbox-group v-model="currentOptions.appointList" class="ml-20 mt-10" @change="changeAppointList">
                <el-checkbox v-for="(item, index ) in currentOptions.appointLength" :key="index" :label="item" :disabled="currentOptions.value !== 'appoint'">{{ handlerFormat(item) }}</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-radio-group>
          <div style="font-size: 14px;font-weight:700;" class="mt-10 mb-10">最近运行时间：</div>
          <el-col v-for="item in lastTimeList">
            {{ item }}
          </el-col>
          <div style="color: #F56C6C">{{ errorDes}}</div>
        </el-tabs>
      </el-popover>
    </template>
  </el-input>
</template>

<script>
import { JobInfoController } from '@controller';
import { BaseVue, _ } from '@lib';
import { options } from './model';
export default {
  name: 'cron',
  mixins: [BaseVue],
  components: { },
  mixins: [],
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      lastTimeList: [],
      errorDes: '',
      activeName: 'second',
      currentOptions: _.cloneDeep(options.second),
      options: _.cloneDeep(options)
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val, oldVal) {
        if (val) {
          this.getTimeList(val)
          const temp = val.split(' ')
          temp.forEach((item, index) => {
            let currentObj = {}
            if (item === '*') {
              currentObj.value = '*'
            } else if (item.indexOf('-') !== -1) {
              currentObj.value = 'cycle'
              currentObj.cycle1 = item.split('-')[0]
              currentObj.cycle2 = item.split('-')[1]
            } else if (item.indexOf('/') !== -1) {
              currentObj.value = 'once'
              currentObj.start = item.split('/')[0]
              currentObj.end = item.split('/')[1]
            } else if (item.indexOf(',') !== -1) {
              currentObj.value = 'appoint'
              currentObj.appointList = item.split(',')
            } else if (item.indexOf('?') !== -1) {
              currentObj.value = 'noAppoint'
            } else if (item.indexOf('W') !== -1) {
              currentObj.value = 'weekday'
              currentObj.extraValue = item.split('W')[0]
            } else if (item.indexOf('L') === 0) {
              currentObj.value = 'last'
            } else if (item.indexOf('L') !== -1) {
              currentObj.value = 'last1'
              currentObj.extraValue = item.split('L')[0]
            }
            const arr = ['second', 'minutes', 'hour', 'day', 'month', 'week', 'year']
            this.options[arr[index]] = {
              ...this.options[arr[index]],
              ...currentObj
            }
          })
          this.currentOptions = this.options[this.activeName]
        } else if (!val) {
          this.options = _.cloneDeep(options)
        }
      }
    }
  },
  async mounted() {
    // this.currentOptions = this.options[this.activeName]
  },
  methods: {
    refresh() {
      this.activeName = 'second'
      this.options = _.cloneDeep(options)
      this.currentOptions = this.options[this.activeName]
    },
    async getTimeList(val) {
      const resp = await this.dispatch(JobInfoController.nextTriggerTime, {
        scheduleType: 'CRON',
        scheduleConf: val
      })
      const { code, content, msg } = resp.data
      if (code === 200) {
        this.lastTimeList = content
        this.errorDes = null
      } else {
        this.lastTimeList = []
        this.errorDes = msg
      }
    },
    tabClick({ name }) {
      this.currentOptions = this.options[name]
    },
    handlerFormat(val) {
      // let data = val
      // if (['day', 'month', 'week'].includes(this.activeName)) {
      //   data = String(Number(data) + 1)
      // }
      if (this.activeName !== 'week' && val.length === 1) {
        return '0' + val
      } else {
        return val
      }
      // return data
    },
    changeCurrent(val) {
      let tempValue = this.value && this.value.split(' ') || []
      // 字符串长度不同，所以转换成数组
      if (tempValue.length < 6) {
        tempValue = '* * * * * ?'.split(' ')
      }
      
      let shortValue = '*'
      if (val === 'cycle') {
        shortValue = this.currentOptions.cycle1 + '-' + this.currentOptions.cycle2
      } else if (val === 'once') {
        shortValue = this.currentOptions.start + '/' + this.currentOptions.end
      } else if (val === 'appoint') {
        if (!this.currentOptions.appointList.length) {
          if (['day', 'month', 'week'].includes(this.activeName)) {
            this.currentOptions.appointList = ['1']
          } else {
            this.currentOptions.appointList = ['0']
          }
        }
        shortValue = this.currentOptions.appointList.join(',')
      } else if (val === 'noAppoint') {
        shortValue = '?'
      } else if (val === 'weekday') {
        shortValue = this.currentOptions.extraValue + 'W'
      } else if (val === 'last') {
        shortValue = 'L'
      } else if (val === 'last1') {
        shortValue = this.currentOptions.extraValue + 'L'
      }

      if (this.activeName === 'second') {
        tempValue[0] = shortValue
      } else if (this.activeName === 'minutes') {
        tempValue[1] = shortValue
      } else if (this.activeName === 'hour') {
        tempValue[2] = shortValue
      } else if (this.activeName === 'day') {
        tempValue[3] = shortValue
      } else if (this.activeName === 'month') {
        tempValue[4] = shortValue
      } else if (this.activeName === 'week') {
        tempValue[5] = shortValue
      } else if (this.activeName === 'year') {
        if (val == 'none') {
          tempValue = tempValue.slice(0,6)
        } else {
          tempValue[6] = shortValue
        }
      }
      this.$emit('input', tempValue.join(' '))
      this.getTimeList(tempValue.join(' '))
    },
    changeAppointList(val) {
      this.changeCurrent('appoint')
    },
    blurInput(type) {
      this.currentOptions.value = type
      this.changeCurrent(type)
    },
    inputValue(val) {
      this.$emit('input', val)
    }
  },
}
</script>
<style lang="scss" scoped>
  .top-tool-bar {
    height: 50px;
    line-height: 50px;
    background-color: #f2f2f2;
    padding: 0 50px;
    .el-col {
      float: right;
      text-align: center;
      .btn {
        width: 70px;
        display: inline-block;
        cursor: pointer;
      }
    }
  }
  .log-container {
    margin-top: 1px;
  }
  .el-tabs {
    ::v-deep .el-tabs__content {
      min-height: 350px;
    }
    ::v-deep .el-input__inner {
      padding: 0 3px;
      text-align: center;
    }
    ::v-deep .el-checkbox__label {
      padding-left: 5px;
    }
    .el-checkbox {
      margin-right: 2px;
    }
  }
  .openPopover {
    cursor: pointer;
    &::before, &::after {
      content: '';
      display: inline-block;
      width: 20px;
      height: 15px;
      top: 0px;
      left: 0;
    }
  }
  ::v-deep .el-input-group__append, .el-input-group__prepend {
    padding: 0;
  }
  
</style>
