<template>
  <view class="order-preview">
    <template v-if="!vuex_token">
      <u-empty class="u-p-80" mode="permission" color="#82848a" text="登录之后才能预览订单">
        <template #bottom>
          <u-button class="u-m-t-20" size="medium" @click="handleLoginClick">登录</u-button>
        </template>
      </u-empty>
    </template>
    <template v-else>
      <u-cell-group>
        <u-cell-item
          :title="showAddress.title"
          :label="showAddress.label"
          @click="handleAddressClick"
        ></u-cell-item>
      </u-cell-group>
      <view class="cart-list u-p-20">
        <view
          class="cart-item u-flex u-col-center u-m-b-20 u-p-10"
          v-for="item in cartList"
          :key="item.id"
          @click="handleItemClick(item)"
        >
          <u-image width="200" height="200" mode="aspectFit" :src="item.goods.cover_url">
            <u-loading slot="loading"></u-loading>
          </u-image>
          <view class="info u-flex-1 u-p-t-20 u-p-b-20">
            <view class="title u-line-1 u-font-32">{{ item.goods.title }}</view>
            <view class="price u-m-t-10 u-p-l-10 u-font-32">￥：{{ item.goods.price }}</view>
            <view class="num u-m-t-15 u-p-l-15 u-font-26 u-tips-color">数量：{{ item.num }}</view>
          </view>
        </view>
      </view>
      <view class="bottom u-flex u-row-right u-col-center u-p-l-28 u-p-r-28">
        <view class="u-flex u-col-center">
          <view class="total-text u-font-30">合计:</view>
          <view class="total-price u-m-l-5 u-font-30">￥{{ totalPrice }}</view>
          <u-button class="submit-btn u-m-l-30" type="primary" disabled>提交订单并支付</u-button>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
export default {
  name: 'OrderPreview',
  data() {
    return {
      cartList: [],
      addressList: []
    }
  },
  computed: {
    showAddress() {
      if (!this.addressList.length) {
        return {
          title: '暂无收货地址',
          label: ''
        }
      }
      let target = this.addressList.find(item => item.id === this.vuex_addressId)
      !target && (target = this.addressList.find(item => item.is_default === 1))
      !target && (target = this.addressList[0])
      return {
        title: target.name + ' ' + target.phone,
        label: target.province + ' ' + target.city + ' ' + target.county + ' ' + target.address
      }
    },
    totalPrice() {
      return this.cartList.reduce((prev, item) => prev + item.num * item.goods.price, 0)
    }
  },
  methods: {
    async getPreview() {
      const res = await this.$_api.order.getPreview(undefined, {
        loading: {
          title: '获取订单信息中'
        }
      })
      this.cartList = res.carts
      this.addressList = res.address
    },
    handleAddressClick() {
      this.$_router.navigateTo({
        url: '/pages/address/main',
        options: {
          select: 1
        }
      })
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
      this.getPreview()
    }
  }
}
</script>

<style scoped lang="scss">
.order-preview {
  padding-bottom: 100rpx;

  /deep/ .u-cell {
    padding: 15rpx;
  }

  .cart-list {
    .cart-item {
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

.bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: var(--window-bottom);
  height: 100rpx;
  background-color: #fff;

  .total-text {
    font-weight: 800;
  }

  .total-price {
    font-weight: 800;
    color: #e83333;
  }

  .settle-btn {
    width: 180rpx;
    height: 70rpx;
    line-height: 70rpx;
  }
}
</style>
