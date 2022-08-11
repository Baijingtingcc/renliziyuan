import ToolBar from '@/components/ToolBar'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import ScreenFull from './ScreenFull'
import ThemePicker from './ThemePicker'
import Lang from './lang'
import TagsView from '@/components/TagsView'

export default {
  install(Vue) {
    Vue.component(ToolBar.name, ToolBar)
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    Vue.component(ImageUpload.name, ImageUpload)
    Vue.component('ScreenFull', ScreenFull)
    Vue.component(ThemePicker.name, ThemePicker)
    Vue.component(Lang.name, Lang)
    Vue.component(TagsView.name, TagsView)
  }
}
