<template>
  <view class="comment-card u-flex u-col-top u-m-t-15 u-m-b-15">
    <u-image
      width="64"
      height="64"
      shape="circle"
      mode="aspectFill"
      :src="commentInfo.user.avatar_url"
    >
      <u-loading slot="loading"></u-loading>
    </u-image>
    <view class="u-flex-1 u-p-l-20 u-font-30">
      <view class="u-flex u-row-between u-col-center">
        <view class="name">{{ commentInfo.user.name }}</view>
        <view class="star u-flex u-col-center u-font-26">
          <text>{{ commentInfo.star }}</text>
          <u-icon class="u-m-l-4" name="thumb-up" :size="30"></u-icon>
        </view>
      </view>
      <view class="content u-p-t-10 u-p-b-10">{{ commentInfo.content }}</view>
      <view class="reply u-p-t-10 u-p-b-10 u-p-l-20 u-p-r-20 u-font-28">
        {{ commentInfo.reply }}
      </view>
      <view class="create-at u-p-t-5 u-p-b-5 u-font-24">{{ commentInfo.created_at }}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CommentCard',
  props: {
    commentInfo: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped lang="scss">
.comment-card {
  .name {
    color: #5677fc;
  }

  .star {
    color: #9a9a9a;
  }

  .content {
    color: #303133;
  }

  .reply {
    border-radius: 12rpx;
    background-color: #f2f2f2;
  }

  .create-at {
    color: #9a9a9a;
  }
}
</style>
