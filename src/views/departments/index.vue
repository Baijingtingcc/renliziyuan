<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card shadow="always" class="card">
        <tree-tool :tree-data="company" :is-root="true" @handeladdDept="handeladdDept" />
      </el-card>
      <el-tree :data="departs" :props="defaultProps" default-expand-all>
        <template v-slot="{data}">
          <tree-tool :tree-data="data" :is-root="false" @getDepartments="getDepartments" @handeladdDept="handeladdDept" @handelEditDept="handelEditDept" />
        </template>
      </el-tree>
    </div>
    <addDept ref="form" :is-show-dept.sync="isShowDept" :current-node="currentNode" />
  </div>
</template>

<script>
import { transTree } from '@/utils/index.js'
import { getDepartments } from '@/api/departments'
import treeTool from './components/tree-tool.vue'
import addDept from './components/add-dept.vue'
export default {
  components: { treeTool, addDept },
  data() {
    return {
      loading: false,
      currentNode: {},
      isShowDept: false,
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      departs: [{ name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    handelEditDept(node) {
      this.isShowDept = true
      console.log(node)
      this.$refs.form.getDepartDetail(node.id)
    },
    handeladdDept(node) {
      this.isShowDept = true
      this.currentNode = node
    },
    async getDepartments() {
      try {
        this.loading = true
        const res = await getDepartments()
        console.log(res)
        this.company = { name: res.companyName, manager: res.companyManage || '管理员', id: '' }
        this.departs = transTree(res.depts, '') // 需要将其转化成树形结构
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.dashboard-container{
  .app-container {
    width: 850px;
    border: solid 1px pink;
    margin: 50px auto;
    .card{
      background-color: #a6cafa;
    }
  }
}
</style>
