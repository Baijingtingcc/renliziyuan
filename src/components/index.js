import ToolBar from '@/components/ToolBar'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'

export default {
  install(Vue) {
    Vue.component(ToolBar.name, ToolBar)
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    Vue.component(ImageUpload.name, ImageUpload)
  }
}
