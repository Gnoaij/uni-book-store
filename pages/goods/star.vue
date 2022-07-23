<template>
  <view class="goods-star">
    <template v-if="!vuex_token">
      <u-empty class="u-p-80" mode="permission" color="#82848a" text="登录之后才能查看收藏列表">
        <template #bottom>
          <u-button class="u-m-t-20" size="medium" @click="handleLoginClick">登录</u-button>
        </template>
      </u-empty>
    </template>
    <template v-else>
      <template v-if="!starList.length">
        <u-empty class="u-p-80" mode="list" color="#82848a" text="收藏列表空空如也"></u-empty>
      </template>
      <template v-else>
        <view class="star-list u-p-20">
          <view
            class="star-item u-flex u-col-center u-m-b-20 u-p-10"
            v-for="item in starList"
            :key="item.id"
            @click="handleItemClick(item)"
          >
            <u-image width="200" height="200" mode="aspectFit" :src="item.goods.cover_url">
              <u-loading slot="loading"></u-loading>
            </u-image>
            <view class="info u-flex-1 u-flex-col u-row-between u-p-t-20 u-p-b-20">
              <view>
                <view class="title u-line-1 u-font-32">{{ item.goods.title }}</view>
                <view class="price u-m-t-10 u-p-l-10 u-line-1 u-font-32">
                  ￥：{{ item.goods.price }}
                </view>
              </view>
              <view class="create-at u-p-l-10 u-line-1 u-font-26 u-tips-color">
                收藏于：{{ item.created_at }}
              </view>
            </view>
          </view>
        </view>
      </template>
    </template>
  </view>
</template>

<script>
export default {
  name: 'GoodsStar',
  data() {
    return {
      starList: []
    }
  },
  methods: {
    async getStarList() {
      const res = await this.$_api.goods.getStarList(undefined, {
        loading: { title: '获取收藏列表中' }
      })
      this.starList = res.data
    },
    handleItemClick(item) {
      this.$_router.navigateTo({
        url: '/pages/goods/info',
        options: {
          id: item.goods_id
        }
      })
    },
    handleLoginClick() {
      this.$_router.navigateTo({
        url: '/pages/auth/login'
      })
    }
  },
  onShow() {
    if (this.vuex_token) {
      this.getStarList()
    }
  }
}
</script>

<style scoped lang="scss">
.goods-star {
  .star-list {
    .star-item {
      box-shadow: 0 0 5rpx 6rpx rgba(#ccc, 0.3);

      .info {
        width: 0;
        height: 200rpx;

        .title {
          font-weight: 800;
        }

        .price {
          font-weight: 800;
          color: #e83333;
        }
      }
    }
  }
}
</style>
