<template>
  <el-backtop :bottom="50">
    <div class="m-backtop">
      <el-icon>
        <caret-top />
      </el-icon>
    </div>
  </el-backtop>
</template>

<script lang="ts" setup>
import { CaretTop } from '@element-plus/icons-vue'
</script>

<style lang='scss' scoped>
.m-backtop {
  height: 100%;
  width: 100%;
  background-color: #f2f5f6;
  text-align: center;
  line-height: 40px;
  color: #1989fa;
  border-radius: 50%;
}
</style>
