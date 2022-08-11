<template>
  <div class="container">
    <svg-icon icon-class="fullscreen" style="color:#fff; width: 20px; height: 20px" @click="changeScreen" />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'

export default {
  name: 'ScreenFull',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    changeScreen() {
      if (ScreenFull.isEnabled) {
        ScreenFull.toggle()
      }
    }
  }
}
</script>
<style scoped lang="less"></style>
