<template>
  <div>
    <el-upload
      :http-request="upload"
      :before-upload="beforeUpload"
      :class="{completed:isFileLength}"
      action="#"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="file"
      :on-change="changeFile"
      :limit="1"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercen" :percentage="percentage" style="width: 200px;" />
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5'

const cos = new COS({
  SecretId: 'AKIDXyDH8mDRSIufCUZQ3RcZJo8FNHwNbaKr',
  SecretKey: 'MhojT2NTL0QbYIn4A1wd4HH5f3FE0azC'
})
export default {
  name: 'ImageUpload',
  data() {
    return {
      percentage: 0,
      dialogImageUrl: '',
      dialogVisible: false,
      file: [
        {
          url: 'https://img1.baidu.com/it/u=1960292808,1761809160&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
        }
      ],
      showPercen: false
    }
  },
  computed: {
    isFileLength() {
      return this.file.length >= 1
    }
  },
  methods: {
    changeFile(file, fileList) {
      this.file = fileList
    },
    handleRemove(file, fileList) {
      this.file = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeUpload(file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('图片类型错误')
        return false
      }
      const maxSize = 5 * 1024 * 1024 // 1M=1024KB 1KB = 1024B
      if (file.size > maxSize) {
        this.$message.error('文件太大了')
        return false
      }
      this.showPercen = true
    },
    upload({ file }) {
      if (!file) return
      cos.putObject({
        Bucket: 'goodbai-1259028191', // 存储桶
        Region: 'ap-nanjing', // 地域
        Key: file.name, // 文件名
        Body: file, // 要上传的文件对象
        StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
        onProgress: ({ percent }) => {
          this.percentage = percent * 100
        }
        // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
      }, (err, data) => {
        // data返回数据之后 应该如何处理
        if (err) {
          return this.$message.error(err?.message || '上传出错')
        }
        this.file.forEach(item => {
          if (item.uid === file.uid) {
            item.url = `http://${data.Location}`
            item.upload = true
          }
        })
        this.showPercen = false
        this.percentage = 0
      })
    }
  }
}
</script>
<style scoped lang="scss">
.completed {
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
</style>
