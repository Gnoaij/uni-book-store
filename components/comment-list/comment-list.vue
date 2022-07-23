<template>
  <view class="comment-list u-p-l-20 u-p-r-20">
    <template v-if="!commentList.length">
      <u-empty class="u-p-80" mode="list" color="#82848a" text="暂无评论"></u-empty>
    </template>
    <template v-else>
      <comment-card v-for="item in commentList" :key="item.id" :comment-info="item"></comment-card>
    </template>
  </view>
</template>

<script>
export default {
  name: 'CommentList',
  props: {
    commentList: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped lang="scss"></style>
