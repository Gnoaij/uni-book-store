<template>
  <view class="address-main">
    <template v-if="!vuex_token">
      <u-empty class="u-p-80" mode="permission" color="#82848a" text="登录之后才能查看收货地址">
        <template #bottom>
          <u-button class="u-m-t-20" size="medium" @click="handleLoginClick">登录</u-button>
        </template>
      </u-empty>
    </template>
    <template v-else>
      <template v-if="!addressList.length">
        <u-empty class="u-p-80" mode="list" color="#82848a" text="暂无收货地址"></u-empty>
      </template>
      <template v-else>
        <view class="address-list">
          <u-swipe-action
            v-for="(item, index) in addressList"
            :key="item.id"
            :index="index"
            :btn-width="160"
            :options="actionOptions"
            @click="handleActionClick"
          >
            <view
              class="address-item u-flex u-row-between u-col-center u-p-l-25 u-p-r-25 u-p-t-20 u-p-b-20"
            >
              <view class="content u-flex-1" @click="handleContentClick(item)">
                <view class="u-flex u-col-center">
                  <view class="name u-font-30">{{ item.name }}</view>
                  <view class="phone u-m-l-20 u-font-30">{{ item.phone }}</view>
                  <view class="tag u-m-l-20 u-p-l-5 u-p-r-5 u-font-20" v-if="item.is_default === 1">
                    默认
                  </view>
                </view>
                <view class="u-m-t-10">
                  <view class="detail u-line-1 u-font-26 u-tips-color">
                    {{ item.province + ' ' + item.city + ' ' + item.county + ' ' + item.address }}
                  </view>
                </view>
              </view>
              <view class="u-m-l-20">
                <u-icon
                  name="edit-pen"
                  color="#909399"
                  :size="36"
                  @click="handleEditClick(item)"
                ></u-icon>
              </view>
            </view>
          </u-swipe-action>
        </view>
      </template>
      <view class="bottom u-flex u-row-center u-col-center">
        <view class="add u-flex u-row-center u-col-center u-font-30" @click="handleAddClick">
          <u-icon name="plus" color="#fff" :size="30"></u-icon>
          <view class="u-m-l-10">新建收货地址</view>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
export default {
  name: 'AddressMain',
  data() {
    return {
      addressList: [],
      actionOptions: [
        {
          text: '默认',
          style: {
            fontSize: '24rpx',
            backgroundColor: '#007aff'
          }
        },
        {
          text: '删除',
          style: {
            fontSize: '24rpx',
            backgroundColor: '#dd524d'
          }
        }
      ],
      isSelect: false
    }
  },
  methods: {
    async getAddressList() {
      const res = await this.$_api.address.getList(undefined, {
        loading: { title: '获取收货地址中' }
      })
      this.addressList = res.data
    },
    async updateDefault(targetIndex) {
      const targetItem = this.addressList[targetIndex]
      await this.$_api.address.updateDefault(
        { id: targetItem.id },
        { loading: { title: '设置默认地址中', mask: true } }
      )
      // this.getAddressList()
      this.addressList.forEach(item => {
        item.is_default = item.id === targetItem.id ? 1 : 0
      })
    },
    async remove(targetIndex) {
      const targetItem = this.addressList[targetIndex]
      await this.$_api.address.remove(
        { id: targetItem.id },
        { loading: { title: '删除收货地址中', mask: true } }
      )
      // this.getAddressList()
      this.addressList = this.addressList.filter(item => item.id !== targetItem.id)
    },
    handleActionClick(targetIndex, action) {
      if (action === 0) {
        this.updateDefault(targetIndex)
      } else {
        this.remove(targetIndex)
      }
    },
    handleContentClick(targetItem) {
      if (this.isSelect) {
        this.vuex('vuex_addressId', targetItem.id)
        this.$_router.navigateBack()
      }
    },
    handleEditClick(targetItem) {
      this.$_router.navigateTo({
        url: '/pages/address/action',
        options: {
          id: targetItem.id
        }
      })
    },
    handleAddClick() {
      this.$_router.navigateTo({
        url: '/pages/address/action'
      })
    },
    handleLoginClick() {
      this.$_router.navigateTo({
        url: '/pages/auth/login'
      })
    }
  },
  onLoad(options) {
    if (options.select) {
      this.isSelect = true
    }
  },
  onShow() {
    if (this.vuex_token) {
      this.getAddressList()
    }
  }
}
</script>

<style scoped lang="scss">
.address-main {
  .address-list {
    .address-item {
      border-bottom: 2rpx solid #e4e7ed;

      .content {
        width: 0;

        .name,
        .phone {
          font-weight: 600;
        }

        .tag {
          color: #fff;
          border-radius: 6rpx;
          background-color: #3191fd;
        }
      }
    }
  }

  .bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 40rpx;

    .add {
      width: 600rpx;
      height: 100rpx;
      color: #fff;
      background-color: #f00;
      border-radius: 60rpx;
    }
  }
}
</style>
