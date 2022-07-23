<template>
  <view class="goods-cart u-m-10 u-p-20" @click="handleCardClick">
    <u-image class="u-skeleton-rect" height="300" mode="aspectFit" :src="goodsInfo.cover_url">
      <u-loading slot="loading"></u-loading>
    </u-image>
    <view class="title u-m-t-10 u-m-b-10 u-line-1 u-font-30 u-skeleton-rect">
      {{ goodsInfo.title || '商品名称' }}
    </view>
    <view class="u-flex u-row-between">
      <view class="price u-p-l-4 u-font-28 u-skeleton-rect">￥{{ goodsInfo.price }}</view>
      <view class="sales u-p-r-4 u-text-right u-font-24 u-skeleton-rect">
        已售:{{ goodsInfo.sales }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'GoodsCard',
  props: {
    goodsInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    handleCardClick() {
      this.$_router.navigateTo({
        url: '/pages/goods/info',
        options: {
          id: this.goodsInfo.id
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.goods-cart {
  box-shadow: 0 10rpx 20rpx 0 rgba(#000, 0.3);

  .title {
    font-weight: 550;
  }

  .price {
    width: 45%;
    font-weight: 550;
    color: #f00;
  }

  .sales {
    width: 45%;
    color: #ccc;
  }
}
</style>
