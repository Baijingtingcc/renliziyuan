<template>
  <div class="dashboard-container">
    <div class="app-container">
      <TooBar>
        <template #after>
          <el-button type="primary" size="mini" @click="addPermission('0',1)">添加权限</el-button>
        </template>
      </TooBar>
      <el-table border :data="list" row-key="id">
        <el-table-column align="center" label="序号" type="index" />
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <el-button type="text" @click="addPermission(row.id,2)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <el-dialog :visible.sync="showDialog" :title="`${title}权限`">
      <el-form ref="form" :model="formData" :rules="rules">
        <el-form-item label="权限名称" label-width="80px" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识" label-width="80px" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述" label-width="80px">
          <el-input v-model="formData.description" />
        </el-form-item>
        <el-form-item label="是否开启" label-width="80px">
          <el-switch
            v-model="formData.enVisible"
            active-color="#66b1ff"
            inactive-color="#ff4949"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="12">
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
          <el-button size="small" @click="showDialog = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  addPermission,
  delPermission,
  getPermissionDetail,
  getPermissionList,
  updatePermission
} from '@/api/permission'
import { transTree } from '@/utils'

export default {
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [
          {
            required: true,
            message: '必选项不能为空',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '必选项不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async editPermission(id) {
      const res = await getPermissionDetail(id)
      this.formData = res
      this.showDialog = true
    },
    async delPermission(id) {
      await this.$confirm('确认删除吗')
      await delPermission(id)
      this.$message.success('删除成功')
      await this.getPermissionList()
    },
    async btnOk() {
      await this.$refs.form.validate()
      try {
        if (this.formData.id) {
          //  编辑
          await updatePermission(this.formData)
        } else {
          await addPermission(this.formData)
        }
        await this.getPermissionList()
        this.$message.success(`${this.title}权限点成功`)
        this.close()
      } catch (e) {
        this.$message.error('新增失败')
        this.close()
      }
    },
    close() {
      this.$refs.form.resetFields()
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.showDialog = false
    },
    addPermission(pid, type) {
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    async getPermissionList() {
      const res = await getPermissionList()
      this.list = transTree(res, '0')
    }
  }
}
</script>

<style>

</style>
