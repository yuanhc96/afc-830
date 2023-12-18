<template>
  <el-dropdown trigger="click" @visible-change="visibleChanged">
    <div>
      <el-button :style="`width:${width}px`" icon="el-icon-date">
        <span v-if="showLabel">{{ currTime ? currTime.text : '时间:' }}</span> <i class="el-icon-caret-bottom" /></el-button>
    </div>
    <el-dropdown-menu slot="dropdown">
      <div class="p-10" style="width: 300px">
        <label for="">时间选择</label>
        <div class="border-bottom-1 mt-5 mb-5" />
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-col
                v-for="time in times1"
                :key="time"
                :span="24"
              ><a :class="{ blue: true, selected: currTime && time === currTime }" @click="selectDuration(time)">{{ time.text }}</a>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col
                v-for="time in times2"
                :key="time"
                :span="24"
              ><a
                :class="{ blue: true, selected: currTime && time.text === currTime.text }"
                @click="selectDuration(time)"
              >{{ time.text }}</a>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
import moment from 'dayjs'

const times1 = [
  { duration: 2, unit: 'DAY', text: 'Last 2 days' },
  { duration: 7, unit: 'DAY', text: 'Last 7 days' },
  { duration: 14, unit: 'DAY', text: 'Last 14 days' },
  { duration: 30, unit: 'DAY', text: 'Last 30 days' },
  { duration: 6, unit: 'MONTH', text: 'Last 6 months' },
  { duration: 12, unit: 'MONTH', text: 'Last 12 months' },
]
const times2 = [
  { duration: 15, unit: 'MINUTE', text: 'Last 15 minutes' },
  { duration: 30, unit: 'MINUTE', text: 'Last 30 minutes' },
  { duration: 1, unit: 'HOUR', text: 'Last 1 hour' },
  { duration: 6, unit: 'HOUR', text: 'Last 6 hours' },
  { duration: 12, unit: 'HOUR', text: 'Last 12 hours' },
  { duration: 24, unit: 'HOUR', text: 'Last 24 hours' },
]

export default {
  name: 'fast-time-range',
  props: {
    showLabel: {
      default: true,
    },
    width: {
      default: '200px',
    },
    defaultValue: {
      default: times2[5],
    }
  },
  data() {
    return {
      times1: times1,
      times2: times2,
      currTime: null,
    }
  },
  mounted() {
    this.selectDuration(this.defaultValue)
  },
  methods: {
    reset() {
      this.selectDuration(this.defaultValue)
    },
    selectDuration(time) {
      this.currTime = time
      const end = moment()
      const begin = moment().subtract(time.duration, time.unit)
      this.$emit('selectDuration', {
        begin,
        end,
        unit: time.unit,
      })
    },
  },
}
</script>
<style lang="scss" scoped>
  .selected {
    color: #ed3f14;
    font-weight: bold;
  }
</style>
