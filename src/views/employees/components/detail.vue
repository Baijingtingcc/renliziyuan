<template>
  <div class="container">
    <el-card>
      <el-tabs>
        <el-tab-pane label="登录账号设置">
          <el-form ref="formRef" :model="formData" :rules="rules" class="form">
            <el-form-item label="姓名" prop="username">
              <el-input v-model="formData.username" style="width: 40%" />
            </el-form-item>
            <el-form-item label="密码" prop="password2">
              <el-input v-model="formData.password2" style="width: 40%" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveUserDetailById">更新</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情">
          <component :is="UserInfo" />
        </el-tab-pane>
        <el-tab-pane label="岗位信息">
          <component :is="JobInfo" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from '@/views/employees/components/user-info'
import JobInfo from '@/views/employees/components/job-info'

export default {
  components: { UserInfo, JobInfo },
  props: {},
  data() {
    return {
      JobInfo: 'JobInfo',
      UserInfo: 'UserInfo',
      formData: {
        username: '',
        password2: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }
        ],
        password2: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getUserDetailById()
  },
  mounted() {
  },
  methods: {
    async getUserDetailById() {
      const res = await getUserDetailById(this.$route.params.id)
      this.formData = res
    },
    async saveUserDetailById() {
      await this.$refs.formRef.validate()
      try {
        await saveUserDetailById({
          ...this.formData,
          password: this.formData.password2
        })
        this.$message.success('更新成功')
      } catch (e) {
        this.$message('更新失败')
      }
    }
  }
}
</script>
<style scoped lang="scss">
.container {
  margin: 20px;

  .form {
    margin-top: 30px;
  }
}

</style>
