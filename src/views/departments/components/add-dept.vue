<template>
  <el-dialog :visible="isShowDept" :title="`${showTitle}部门`" @close="close">
    <el-form ref="form" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option
            v-for="item in options"
            :key="item.id"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button type="primary" size="small" @click="subimt">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { getEmployeeSimple } from '@/api/employees'
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
export default {
  name: 'AddDept',
  props: {
    isShowDept: {
      type: Boolean,
      default: false
    },
    currentNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const checkName = async(rule, value, callback) => {
      console.log(value)
      // 拿到全部的数据
      const { depts } = await getDepartments()
      console.log(depts)
      //   筛选数点击的这一项的子级部门
      let childrenDepts = null
      if (this.formData.id) {
        childrenDepts = depts.filter(item => item.pid === this.currentNode.pid && item.id !== this.currentNode.id)
      } else {
        childrenDepts = depts.filter(item => {
          return item.pid === this.currentNode.id
        })
      }
      console.log(childrenDepts)
      const isFalg = childrenDepts.some(item => item.name === value)
      if (isFalg) {
        return Promise.reject('部门名称重复')
      }
    }
    const checkCode = async(rule, value) => {
      const { depts } = await getDepartments()
      let isCodeFlag = null
      if (this.formData.id) {
        // --> 新增的编辑判断逻辑：编辑的时候，需要把自己过滤掉再进行判断
        isCodeFlag = depts.some(item => item.code === value && item.id !== this.currentNode.id)
      } else {
        isCodeFlag = depts.some(item => (item.code === value))
      }
      if (isCodeFlag) {
        return Promise.reject('部门编码重复了')
      }
    }
    return {
      options: [],
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          {
            required: true,
            message: '部门名称不能为空'
          },
          {
            min: 1,
            max: 50,
            message: '部门名称只能1-50字之间'
          },
          {
            validator: checkName,
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '部门编码不能为空'
          },
          {
            min: 1,
            max: 50,
            message: '部门编码只能1-50字之间'
          },
          {
            validator: checkCode,
            trigger: 'blur'
          }
        ],
        manager: [
          {
            required: true,
            message: '部门负责人不能为空'
          }
        ],
        introduce: [
          {
            required: true,
            message: '部门介绍不能为空'
          },
          {
            min: 1,
            max: 300,
            message: '部门介绍只能1-300字之间'
          }
        ]
      }
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  methods: {
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    },
    async getEmployeeSimple() {
      this.options = await getEmployeeSimple()
    },
    async subimt() {
      await this.$refs.form.validate()
      if (this.formData.id) {
        await updateDepartments(this.formData)
      } else {
        await addDepartments({
          ...this.formData,
          pid: this.currentNode.id
        })
      }
      this.$message.success(`${this.showTitle}成功`)
      this.close()
    },
    close() {
      this.$refs.form.resetFields()
      this.$emit('update:isShowDept', false)
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
    }
  }
}
</script>

<style>
</style>
