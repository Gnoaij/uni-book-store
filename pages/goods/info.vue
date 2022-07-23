<template>
  <view class="goods-info">
    <template v-if="Object.keys(goodsInfo).length">
      <view class="main">
        <!-- 商品图片 -->
        <u-image height="480" mode="aspectFit" :src="goodsInfo.cover_url" @click="handleImageClick">
          <u-loading slot="loading"></u-loading>
        </u-image>
        <view class="u-p-20">
          <!-- 基础信息 -->
          <view class="base">
            <view class="title u-font-40 u-line-1">{{ goodsInfo.title }}</view>
            <view class="u-flex u-row-between u-p-15">
              <text class="price u-font-36">￥{{ goodsInfo.price }}</text>
              <text class="u-font-26 u-tips-color">库存: {{ goodsInfo.stock }}</text>
              <text class="u-font-26 u-tips-color">销量: {{ goodsInfo.sales }}</text>
            </view>
          </view>
          <!-- 选项卡 -->
          <view class="u-p-t-10 u-p-b-10">
            <u-tabs
              active-color="#5592f8"
              :bar-width="140"
              :bar-height="6"
              :duration="0.3"
              :is-scroll="false"
              :list="tabsList"
              :current="currentTab"
              @change="handleTabsChange"
            ></u-tabs>
          </view>
          <view class="content">
            <!-- 商品详情 -->
            <template v-if="currentTab == 0">
              <u-parse :html="goodsInfo.details"></u-parse>
            </template>
            <!-- 商品评论 -->
            <template v-else-if="currentTab == 1">
              <comment-list :comment-list="commentList"></comment-list>
            </template>
            <!-- 商品推荐 -->
            <template v-else-if="currentTab == 2">
              <goods-list :goods-list="goodsList"></goods-list>
            </template>
          </view>
        </view>
      </view>
      <!-- 底部菜单 -->
      <view class="menu u-flex u-col-center u-p-l-15 u-p-r-15">
        <view class="u-flex u-col-center u-font-20">
          <view
            class="u-flex-col u-col-center u-p-l-15 u-p-r-15"
            :class="isStar ? 'star-fill' : ''"
            @click="handleStarClick"
          >
            <u-icon :name="isStar ? 'star-fill' : 'star'" :size="40"></u-icon>
            <view class="u-line-1">{{ isStar ? '已收藏' : '收藏' }}</view>
          </view>
          <view
            class="u-flex-col u-col-center u-p-l-15 u-p-r-15 u-relative"
            @click="handleCartClick"
          >
            <u-badge type="error" size="mini" :offset="[-10, 10]" :count="cartCount"></u-badge>
            <u-icon name="shopping-cart" :size="40"></u-icon>
            <view class="u-line-1">购物车</view>
          </view>
        </view>
        <view class="u-flex-1 u-p-l-15 u-p-r-15">
          <u-button
            class="add-btn"
            type="primary"
            :disabled="!goodsInfo.stock"
            @click="showCartOptions = true"
          >
            {{ goodsInfo.stock ? '加入购物车' : '已售罄' }}
          </u-button>
        </view>
      </view>
      <!-- 弹出层 -->
      <u-popup v-model="showCartOptions" mode="bottom" border-radius="20" closeable>
        <view class="cart-options u-p-30">
          <view class="u-flex u-col-top">
            <u-image
              class="image"
              width="160"
              height="160"
              border-radius="15"
              mode="aspectFit"
              :src="goodsInfo.cover_url"
              @click="handleImageClick"
            >
              <u-loading slot="loading"></u-loading>
            </u-image>
            <view class="base u-flex-1 u-p-10">
              <view class="title u-font-36 u-line-1">{{ goodsInfo.title }}</view>
              <view class="price u-font-32 u-p-10">￥{{ goodsInfo.price }}</view>
            </view>
          </view>
          <view class="u-p-t-30">
            <text>选择数量：</text>
            <u-number-box
              v-model="cartOptions.num"
              :min="1"
              :max="goodsInfo.stock"
              :long-press="false"
            ></u-number-box>
          </view>
          <view class="u-p-t-30 u-text-right">
            <u-button type="primary" size="medium" @click="handleAddClick">加入购物车</u-button>
          </view>
        </view>
      </u-popup>
    </template>
  </view>
</template>

<script>
export default {
  name: 'GoodsInfo',
  data() {
    return {
      tabsList: [
        {
          name: '商品详情'
        },
        {
          name: '商品评论',
          count: 0
        },
        {
          name: '商品推荐'
        }
      ],
      currentTab: 0,
      goodsId: 0,
      goodsInfo: {},
      goodsList: [],
      commentList: [],
      cartOptions: {
        goods_id: '',
        num: 1
      },
      showCartOptions: false
    }
  },
  computed: {
    isStar() {
      return !!this.goodsInfo.is_collect
    },
    cartCount() {
      return this.vuex_cartList.find(item => item.goods_id === this.goodsId)?.num ?? 0
    }
  },
  methods: {
    async getGoodsInfo() {
      const res = await this.$_api.goods.getInfo(
        { id: this.goodsId },
        {
          loading: {
            title: '获取商品信息中'
          }
        }
      )
      this.goodsInfo = res.goods
      this.goodsList = res.like_goods
      this.commentList = res.goods.comments
      this.tabsList[1].count = res.goods.comments.length
      uni.setNavigationBarTitle({
        title: this.goodsInfo.title
      })
    },
    async getCartList() {
      const res = await this.$_api.cart.getList({ include: 'goods' })
      this.vuex('vuex_cartList', res.data)
    },
    handleImageClick() {
      if (this.goodsInfo.cover_url) {
        uni.previewImage({
          current: this.goodsInfo.cover_url,
          urls: [this.goodsInfo.cover_url]
        })
      }
    },
    handleTabsChange(event) {
      this.currentTab = event
    },
    async updateStar() {
      await this.$_api.goods.updateStar(
        { id: this.goodsId },
        {
          loading: {
            title: this.isStar ? '取消收藏中' : '收藏商品中',
            mask: true
          },
          toast: {
            title: this.isStar ? '取消收藏成功' : '收藏商品成功'
          }
        }
      )
      // this.getGoodsInfo()
      this.goodsInfo.is_collect = this.isStar ? 0 : 1
    },
    handleStarClick() {
      if (!this.vuex_token) {
        uni.showToast({
          title: '登录之后才可以收藏商品',
          mask: true
        })
        setTimeout(() => {
          this.$_router.navigateTo({
            url: '/pages/auth/login'
          })
        }, 1500)
        return
      }
      this.updateStar()
    },
    async handleAddClick() {
      await this.$_api.cart.add(this.cartOptions, {
        loading: {
          title: '加入购物车中',
          mask: true
        },
        toast: {
          title: '加入购物车成功'
        }
      })
      this.showCartOptions = false
      this.getCartList()
    },
    handleCartClick() {
      this.$_router.switchTab({
        url: '/pages/cart/main'
      })
    }
  },
  onLoad(options) {
    if (options.id) {
      this.goodsId = parseInt(options.id)
      this.cartOptions.goods_id = parseInt(options.id)
    }
  },
  onShow() {
    if (this.goodsId && !Object.keys(this.goodsInfo).length) {
      this.getGoodsInfo()
    }
    if (this.vuex_token && !this.vuex_cartList.length) {
      this.getCartList()
    }
  }
}
</script>

<style scoped lang="scss">
.goods-info {
  padding-bottom: 98rpx;

  .main {
    .title {
      font-weight: 700;
    }

    .price {
      font-weight: 700;
      color: #d12d3a;
    }
  }

  .menu {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 98rpx;
    border-top: solid 2rpx #f2f2f2;
    background-color: #ffffff;
    box-sizing: border-box;

    .star-fill {
      color: #2979ff;
    }

    .add-btn {
      height: 70rpx;
      line-height: 70rpx;
      font-size: 28rpx;
    }
  }

  .cart-options {
    width: 100%;

    .image {
      border: 2rpx solid #9f9f9f;
    }

    .base {
      width: 0;

      .title {
        width: 100%;
        font-weight: 700;
      }

      .price {
        width: 100%;
        font-weight: 700;
        color: #d12d3a;
      }
    }
  }
}
</style>
