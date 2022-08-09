<template>
  <div class="page-tools">
    <div class="app-container">
      <TooBar>
        <span slot="before">共166条记录</span>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('import')">导入</el-button>
          <el-button size="small" type="danger" @click="exportsToExc">导出</el-button>
          <el-button size="small" type="primary" @click="showDialog1">新增员工</el-button>
        </template>
      </TooBar>
    </div>
    <el-card>
      <el-table
        :data="list"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="date"
          label="序号"
          type="index"
          width="80"
        />
        <el-table-column
          prop="username"
          label="姓名"
          width="120"
        />
        <el-table-column
          prop="province"
          label="头像"
          width="120"
        >
          <template v-slot="{row}">
            <el-avatar :src="row.staffPhoto" style="width: 80px; height: 80px;" @click.native="onCode(row.staffPhoto)">
              <template>
                <img src="https://c-ssl.duitang.com/uploads/item/202005/31/20200531000950_yLHSt.jpeg">
              </template>
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column
          prop="workNumber"
          label="工号"
          width="120"
        />
        <el-table-column
          prop="formOfEmployment"
          label="聘用形式"
          width="300"
          :formatter="formatter"
        />
        <el-table-column
          prop="departmentName"
          label="部门名称"
          width="120"
        />
        <el-table-column
          prop="timeOfEntry"
          label="入职时间"
          width="100"
        >
          <template v-slot="{row}">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="账户状态"
          width="100"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="300"
        >
          <template v-slot="{row}">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small" @click="zz(row)">转正</el-button>
            <el-button type="text" size="small">调离</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="editAssign(row.id)">角色</el-button>
            <el-button type="text" :disabled="checkedAb('DELETE_USER')" size="small" @click="delEmp(row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next"
          :page-size="page.size"
          :current-page.sync="page.page"
          :total="total"
          @current-change="changePage"
        />
      </el-row>
    </el-card>
    <add-employee :show-dialog.sync="showDialog" />

    <el-dialog
      title="头像预览"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <AssignRole ref="roleRef" :is-show-dialog.sync="isShowDialog" :current-id="currentId" />
  </div>
</template>

<script>
import Employ from '@/api/constant/employees'
import { getEmployeeList, delEmployee } from '@/api/employees'
import AddEmployee from '@/views/employees/components/add-employee'
import { formatDate } from '@/utils/filters'
import qrcode from 'qrcode'
import AssignRole from '@/views/employees/components/assign-role'
import { mixin } from '@/utils/mixin'

export default {
  components: { AssignRole, AddEmployee },
  mixins: [mixin],
  data() {
    return {
      isShowDialog: false,
      dialogVisible: false,
      showDialog: false,
      list: [],
      total: 0,
      page: {
        page: 1,
        size: 5
      },
      currentId: ''
    }
  },
  created() {
    this.getEmpList()
  },
  methods: {
    zz(row) {
      console.log(row)
    },
    async editAssign(id) {
      this.currentId = id
      await this.$refs.roleRef.getUserDetailById(id)
      this.isShowDialog = true
    },
    onCode(url) {
      this.dialogVisible = true
      this.$nextTick(() => {
        qrcode.toCanvas(this.$refs.myCanvas, url)
      })
    },
    showDialog1() {
      this.showDialog = true
    },
    async delEmp(id) {
      try {
        await this.$confirm('确认删除吗')
        await delEmployee(id)
        await this.getEmpList()
        this.$message.success('删除成功')
      } catch (error) {
        this.$message.error('删除失败')
      }
    },
    async getEmpList() {
      const { rows, total } = await getEmployeeList(this.page)
      this.list = rows
      this.total = total
    },
    changePage(page) {
      //   this.page.page = page
      //   console.log(this.page.page)
      this.getEmpList()
    },
    formatter(a, b, cellValue) {
      const currentEmp = Employ.hireType.find(item => item.id === cellValue)?.value
      return currentEmp || '未知'
    },
    async exportsToExc() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const header = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期', '工号', '部门']

      const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
      const resData = this.formatterData(rows, headers)
      //  魔法注释
      const { export_json_to_excel } = await import(/* webpackChunkName:'export2Excel'*/
        '@/utils/export')
      export_json_to_excel({
        header: header, // 表头 必填
        data: resData, // 具体数据 必填
        filename: 'excel-list', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填
      })
    },
    formatterData(rows, headers) {
      console.log(headers)
      return rows.map(key => {
        return Object.keys(headers).map(item => {
          if (['timeOfEntry', 'correctionTime'].includes(headers[item])) {
            return formatDate(key[headers[item]])
          }
          if (['formOfEmployment'].includes(headers[item])) {
            return Employ.hireType.find(i => i.id === key[headers[item]])?.value || '未知'
          }
          return key[headers[item]]
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-tools {
  margin: 10px 0;

  .before {
    line-height: 34px;

    i {
      margin-right: 5px;
      color: #409eff;
    }

    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
}
</style>
