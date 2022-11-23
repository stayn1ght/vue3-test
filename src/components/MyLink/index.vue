<template>
  <a :href="to" v-if="isExternal" target="_blank">
    <slot></slot>
    <template v-if="showIcon"> &thinsp;<i class="iconfont icon-share"></i> </template>
  </a>
  <router-link :to="to" v-else tag="a">
    <slot></slot>
    <template v-if="showIcon"> &thinsp;<i class="iconfont icon-link"></i> </template>
  </router-link>
</template>
<script setup name="MyLink">
  defineProps({
    to: {
      type: String,
      required: true
    },
    isExternal: {
      type: Boolean,
      default: false
    },
    showIcon: {
      type: Boolean,
      default: true
    }
  })
</script>

<style lang="less" scoped>
  a {
    display: inline;
    color: #2196f3;
    &:hover {
      outline: 0;
      text-decoration: underline;
      color: #0a6ebd;
    }
  }
</style>
