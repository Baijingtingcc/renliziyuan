<template>
  <div>
    <el-row type="flex" justify="end">
      <el-select v-model="currentYear" size="small" style="width: 120px">
        <el-option v-for="item in yearList" :key="item" :label="`${item}年`" :value="item">{{ item }}年</el-option>
      </el-select>
      <el-select v-model="currentMonth" size="small" style="width: 120px;margin-left:10px">
        <el-option v-for="item in 12" :key="item" :label="`${item}月`" :value="item">{{ item }}月</el-option>
      </el-select>
    </el-row>
    <el-calendar v-model="value">
      <template v-slot:dateCell="{ date, data }" class="content">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>
<script>
export default {
  filters: {
    getDay(value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    startDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      currentMonth: null, // 当前月份
      currentYear: null, // 当前年份
      currentDate: null,
      yearList: []
    }
  },
  computed: {
    value: {
      get() {
        return new Date(this.currentYear, this.currentMonth - 1)
      },
      set(val) {
        this.currentYear = val.getFullYear()
        this.currentMonth = val.getMonth() + 1
        console.log(val.day)
      }
    }
  },
  created() {
    console.log(this.startDate.getFullYear())
    this.currentMonth = this.startDate.getMonth() + 1
    this.currentYear = this.startDate.getFullYear()
    this.yearList = Array.from(Array(11), (item, index) => {
      return this.currentYear + index - 5
    })
  },
  methods: {
    isWeek(value) {
      return value.getDay() === 6 || value.getDay() === 0
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-calendar__header {
  display: none;
}

.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: red;
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 15px;
  text-align: center;
}
</style>
