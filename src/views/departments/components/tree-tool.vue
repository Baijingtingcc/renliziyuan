<template>
  <el-row type="flex" class="row-bg" style="width:100%" justify="space-between">
    <el-col>
      <span>{{ treeData.name }}</span>
    </el-col>
    <el-col :span="6">
      <el-row type="flex" justify="space-between">
        <el-col>
          <span>{{ treeData.manager }}</span>
        </el-col>
        <el-col>
          <el-dropdown @command="onClick">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    treeData: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    async onClick(type) {
      if (type === 'add') {
        // 添加逻辑
        this.$emit('handeladdDept', this.treeData)
        console.log('添加')
      } else if (type === 'edit') {
        //  编辑逻辑
        this.$emit('handelEditDept', this.treeData)
        console.log('编辑')
      } else {
        // 删除
        await this.$confirm('确定删除吗')
        console.log('确定删除')
        await delDepartments(this.treeData.id)
        this.$emit('getDepartments')
      }
    }
  }
}
</script>

<style>

</style>
