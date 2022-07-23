<template>
  <view class="cart-main">
    <template v-if="!vuex_token">
      <u-empty class="u-p-80" mode="permission" color="#82848a" text="登录之后才能查看购物车">
        <template #bottom>
          <u-button class="u-m-t-20" size="medium" @click="handleLoginClick">登录</u-button>
        </template>
      </u-empty>
    </template>
    <template v-else>
      <template v-if="!vuex_cartList.length">
        <u-empty class="u-p-80" mode="car" color="#82848a" text="购物车空空如也"></u-empty>
      </template>
      <template v-else>
        <view class="cart-list u-p-15">
          <view
            class="cart-item u-flex u-col-center u-m-b-15"
            v-for="(item, index) in vuex_cartList"
            :key="item.id"
          >
            <view class="checked u-flex u-p-l-10">
              <u-checkbox
                size="40"
                shape="circle"
                :value="!!item.is_checked"
                @input="handleCheckedChange(item, index, $event)"
              ></u-checkbox>
            </view>
            <view class="content u-flex-1 u-flex u-p-10">
              <u-image
                width="200"
                height="200"
                mode="aspectFit"
                :src="item.goods.cover_url"
                @click="handleItemClick(item)"
              >
                <u-loading slot="loading"></u-loading>
              </u-image>
              <view class="info u-flex-1 u-flex-col u-row-between u-p-10">
                <view @click="handleItemClick(item)">
                  <view class="title u-line-1 u-font-32">{{ item.goods.title }}</view>
                  <view class="u-p-l-10 u-line-1 u-font-24 u-tips-color">
                    {{ item.goods.description }}
                  </view>
                  <view class="u-text-right u-font-20 u-tips-color">
                    库存：{{ item.goods.stock }}
                  </view>
                </view>
                <view class="u-flex u-row-between u-col-center">
                  <view class="price u-p-l-10 u-line-1 u-font-34">￥{{ item.goods.price }}</view>
                  <u-number-box
                    bg-color="#F0F0F0"
                    disabled-input
                    :long-press="false"
                    :min="1"
                    :max="item.goods.stock"
                    :value="item.num"
                    @minus="handleNumChange(item, index, $event)"
                    @plus="handleNumChange(item, index, $event)"
                  ></u-number-box>
                  <u-icon
                    name="trash"
                    size="36"
                    color="#e83333"
                    @click="handleRemoveClick(item, $event)"
                  ></u-icon>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="bottom u-flex u-row-between u-col-center u-p-l-28 u-p-r-28">
          <view>
            <u-checkbox
              size="40"
              shape="circle"
              :value="checkedAll"
              @input="handleCheckedAllChange"
            >
              全选
            </u-checkbox>
          </view>
          <view class="u-flex u-col-center">
            <view class="total-text u-font-30">合计:</view>
            <view class="total-price u-m-l-5 u-font-30">￥{{ totalPrice }}</view>
            <u-button
              class="settle-btn u-m-l-30"
              type="primary"
              :disabled="!hasChecked"
              @click="handleSettleClick"
            >
              去结算
            </u-button>
          </view>
        </view>
      </template>
    </template>
  </view>
</template>

<script>
export default {
  name: 'CartMain',
  computed: {
    checkedAll() {
      return !!this.vuex_cartList.length && !this.vuex_cartList.find(item => item.is_checked === 0)
    },
    hasChecked() {
      return !!this.vuex_cartList.length && this.vuex_cartList.find(item => item.is_checked === 1)
    },
    totalPrice() {
      return this.vuex_cartList.reduce(
        (prev, item) => (item.is_checked ? prev + item.num * item.goods.price : prev),
        0
      )
    }
  },
  methods: {
    async getCartList() {
      const res = await this.$_api.cart.getList(
        { include: 'goods' },
        {
          loading: {
            title: '获取购物车列表中'
          }
        }
      )
      this.vuex('vuex_cartList', res.data)
    },
    async handleCheckedChange(targetItem, targetIndex, event) {
      const cart_ids = this.vuex_cartList
        .filter(item =>
          event
            ? item.is_checked === 1 || item.id === targetItem.id
            : item.is_checked === 1 && item.id !== targetItem.id
        )
        .map(item => item.id)
      await this.$_api.cart.updateChecked({ cart_ids }, { loading: { mask: true } })
      // this.getCartList()
      this.vuex(`vuex_cartList.${targetIndex}.is_checked`, event ? 1 : 0)
    },
    async handleCheckedAllChange(event) {
      const cart_ids = event ? this.vuex_cartList.map(item => item.id) : []
      await this.$_api.cart.updateChecked({ cart_ids }, { loading: { mask: true } })
      // this.getCartList()
      this.vuex(
        'vuex_cartList',
        this.vuex_cartList.map(item => ({
          ...item,
          is_checked: event ? 1 : 0
        }))
      )
    },
    async handleNumChange(targetItem, targetIndex, event) {
      const originNum = targetItem.num
      this.vuex(`vuex_cartList.${targetIndex}.num`, event.value)
      try {
        await this.$_api.cart.updateNum(
          { id: targetItem.id, num: event.value },
          { loading: { mask: true } }
        )
        // this.getCartList()
      } catch (e) {
        this.vuex(`vuex_cartList.${targetIndex}.num`, originNum)
      }
    },
    async handleRemoveClick(targetItem, event) {
      await this.$_api.cart.remove({ id: targetItem.id }, { loading: { mask: true } })
      // this.getCartList()
      this.vuex('vuex_cartList', this.vuex_cartList.filter(item => item.id !== targetItem.id))
    },
    handleItemClick(targetItem) {
      this.$_router.navigateTo({
        url: '/pages/goods/info',
        options: {
          id: targetItem.goods_id
        }
      })
    },
    handleSettleClick() {
      this.$_router.navigateTo({
        url: '/pages/order/preview'
      })
    },
    handleLoginClick() {
      this.$_router.navigateTo({
        url: '/pages/auth/login'
      })
    }
  },
  onShow() {
    if (this.vuex_token && !this.vuex_cartList.length) {
      this.getCartList()
    }
  }
}
</script>

<style scoped lang="scss">
.cart-main {
  padding-bottom: 100rpx;

  .cart-list {
    .cart-item {
      width: 100%;

      .checked {
        width: 70rpx;
      }

      .content {
        background-color: #fafafa;

        .info {
          width: 0;
          height: 200rpx;
          box-sizing: border-box;

          .title {
            height: 50rpx;
            line-height: 50rpx;
            font-weight: 800;
          }

          .price {
            width: 30%;
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
}
</style>
