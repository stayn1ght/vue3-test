<template>
  <el-table class="base-table" v-bind="$attrs" :data="tableData" v-loading="loading" ref="table">
    <el-table-column v-if="selection" type="selection" width="60" />
    <el-table-column v-if="expand" type="expand">
      <template #default="scope">
        <slot name="expand" v-bind="scope"></slot>
      </template>
    </el-table-column>
    <el-table-column
      v-for="item in tableHead"
      :key="item.prop"
      :prop="item.prop"
      :label="item.label"
      :width="item.width"
      :sortable="item.sortable ?? true"
      :sort-orders="item.sortOrders"
      :show-overflow-tooltip="item.tooltip ?? false"
    >
      <template v-if="item.customHeader" #header>
        <slot :name="item.prop + 'Header'" v-bind="item"></slot>
      </template>
      <template #default="scope">
        <slot v-if="item.slotName" :name="item.slotName" v-bind="scope"></slot>
        <span v-else>{{ scope.row[item.prop] }}</span>
      </template>
    </el-table-column>
  </el-table>
  <Pagination :total="total" :class="pagiClass" @pagination="pagination" />
</template>
<script setup>
  // typescript enabled
  import { ref } from 'vue'
  import Pagination from '@/components/Pagination/index.vue'

  const emit = defineEmits([
    'handleView',
    'handleEdit',
    'handleDelete',
    'handleSelectionChange',
    'onSelectAll',
    'paginationChange'
  ])

  defineProps({
    tableData: {
      // 表格数据
      type: Array,
      default: () => []
    },
    tableHead: {
      // 表头
      type: Array,
      default: () => []
    },
    tableHeight: {
      // 表格高度
      type: String,
      default: () => '100%'
    },
    formSelect: {
      // 查询条件
      type: Object,
      default() {
        return { skip: 0, limit: 10 }
      }
    },
    total: {
      // 翻页条件
      type: Number,
      default: () => 0
    },
    loading: {
      // 加载
      type: Boolean,
      default: () => false
    },
    operation: {
      // 需要哪些操作按钮
      type: Array,
      default: () => []
    },
    selection: {
      // 全选
      type: Boolean,
      default: () => false
    },
    expand: {
      type: Boolean,
      default: () => false
    },
    index: {
      // 序号
      type: Boolean,
      default: () => false
    },
    radio: {
      // 单选
      type: Boolean,
      default: () => false
    },
    setting: {
      // 表头配置
      type: Boolean,
      default: () => false
    },
    selectAll: {
      // 表头配置
      type: Boolean,
      default: () => false
    },
    tableRowClassName: {
      type: Function,
      default: () => null
    },
    isHighlight: {
      // 是否需要点击高亮当行
      type: Boolean,
      default: () => false
    },
    pagiClass: {
      type: String,
      default: ''
    }
  })

  // 翻页
  const pagination = (data) => emit('paginationChange', data)

  const table = ref(null)
  const toggleRowExpansion = ref(null)
  onMounted(() => {
    toggleRowExpansion.value = table.value.toggleRowExpansion
  })
  defineExpose({ toggleRowExpansion })
</script>
<style lang="less">
  .base-table {
    .cell {
      //line-height:40px;
      font-size: 13px;
      word-wrap: normal;
      word-break: normal;
    }
  }
  .col-setting {
    display: flex;
    justify-content: space-between;
    img {
      cursor: pointer;
      width: 16px;
      height: 15px;
      margin-top: 3px;
    }
  }
  .handle {
    display: flex;
    justify-content: flex-start;
    img {
      margin-right: 10px;
      vertical-align: middle;
      width: 19px;
      height: 18px;
      cursor: pointer;
    }
    .view {
      width: 19px;
      height: 14px;
    }
    .edit {
      width: 15px;
      height: 17px;
    }
  }
</style>
