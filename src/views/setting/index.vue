<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理" name="first">
            <el-button icon="el-icon-plus" type="primary" size="small" @click="dialogVisible=true">新增角色</el-button>
            <el-table
              :data="list"
              style="width: 100%"
            >
              <el-table-column
                label="序号"
                type="index"
                width="50"
              />
              <el-table-column
                prop="name"
                label="角色名称"
                width="180"
              />
              <el-table-column
                prop="description"
                label="描述"
              />
              <el-table-column label="操作">
                <template v-slot="{row}">
                  <el-button
                    size="small"
                    type="success"
                    @click="assPermission(row.id)"
                  >分配权限
                  </el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="edit(row.id)"
                  >编辑
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="del(row.id)"
                  >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="center" style="margin-top: 20px">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="total"
                :page-size="page.pagesize"
                :current-page="page.page"
                @current-change="currentPage"
                @size-change="changeSize"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司设置" name="second">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-dialog
      title="提示"
      :visible="dialogVisible"
      @close="handleClose"
    >
      <el-form ref="roleForm" label-width="120px" :model="roleFormData" :rules="roleRules">
        <el-form-item label="角色" prop="name">
          <el-input v-model="roleFormData.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="roleFormData.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="btnOk">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible="isShowDialog"
      @close="closePermission"
    >
      <el-tree
        ref="treeRef"
        :props="props"
        show-checkbox
        :data="permissionList"
        check-strictly
        node-key="id"
        :default-checked-keys="checkedKeys"
        default-expand-all
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="closePermission">取 消</el-button>
        <el-button type="primary" @click="btnPermission">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { mapGetters } from 'vuex'
import { getPermissionList } from '@/api/permission'
import { transTree } from '@/utils'

export default {
  data() {
    return {
      props: {
        label: 'name'
      },
      checkedKeys: [],
      permissionList: [],
      isShowDialog: false,
      roleFormData: {
        name: '',
        description: ''
      },
      roleRules: {
        name: [
          {
            required: true,
            message: '角色不能为空'
          }
        ]
      },
      dialogVisible: false,
      formData: {},
      page: {
        page: 1,
        pagesize: 2
      },
      list: [],
      total: 0,
      currentId: null
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async btnPermission() {
      const checkedList = this.$refs.treeRef.getCheckedNodes()
      await assignPerm({
        id: this.currentId,
        permIds: checkedList
      })
      this.$message.success('修改成功')
      this.closePermission()
    },
    closePermission() {
      this.isShowDialog = false
      this.checkedKeys = []
    },
    async assPermission(id) {
      this.currentId = id
      const res = transTree(await getPermissionList(id), '0')
      const { permIds } = await getRoleDetail(id)
      this.checkedKeys = permIds
      this.permissionList = res
      this.isShowDialog = true
    },
    async getRoleList() {
      const { rows, total } = await getRoleList(this.page)
      this.list = rows
      this.total = total
    },
    currentPage(page) {
      this.page.page = page
      this.getRoleList()
    },
    changeSize(page) {
      console.log(page)
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    async del(id) {
      await this.$confirm('确认删除?')
      await deleteRole(id)
      const len = this.list.length
      if (len === 1 && this.page.page > 1) {
        this.page.page--
      }
      this.$message.success('删除成功')
      this.getRoleList()
    },
    handleClose() {
      this.dialogVisible = false
      this.$refs.roleForm.resetFields()
      this.roleFormData = {
        name: '',
        description: ''
      }
    },
    async edit(id) {
      this.dialogVisible = true
      this.roleFormData = await getRoleDetail(id)
    },
    async btnOk() {
      await this.$refs.roleForm.validate()
      if (this.roleFormData.id) {
        await updateRole(this.roleFormData)
      } else {
        await addRole(this.roleFormData)
      }
      this.$message.success('修改成功')
      this.getRoleList()
      this.handleClose()
    }
  }
}
</script>

<style scoped lang="scss">
.app-container {
  padding: 20px;
}
</style>
