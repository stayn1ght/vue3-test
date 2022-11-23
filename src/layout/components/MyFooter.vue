<template>
  <div class="page-footer">
    <p>© 2023 GutMycobiomeDB</p>
    <p>
      •
      <my-link
        isExternal
        to="https://evolgeniusteam.github.io/gmrepodocumentation/websiteandUI/websiteoverview/#contact-information"
        :show-icon="false"
      >
        Contact us
      </my-link>
      <span> • citation(s): </span>
      <my-link isExternal to="https://google.com">
        toBeDecided </my-link
      >;
      <my-link isExternal to="https://google.com">
        toBeDecided </my-link
      >.
    </p>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="less">
  .page-footer {
    padding: 15px 0;
    color: #87919f;

    p {
      line-height: 25px;
    }
  }
</style>
