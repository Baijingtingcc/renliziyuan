export const imagerror = {
  // 当dom节点第一次插入到父节点中执行
  inserted(el, options) {
    console.log(options)
    el.onerror = () => {
      el.src = options.value
    }
  }
}
