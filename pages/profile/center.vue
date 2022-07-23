<template>
  <view class="profile-center">
    <template v-if="!vuex_token">
      <u-empty class="u-p-80" mode="permission" color="#82848a" text="登录之后才能访问个人中心">
        <template #bottom>
          <u-button class="u-m-t-20" size="medium" @click="handleLoginClick">登录</u-button>
        </template>
      </u-empty>
    </template>
    <template v-else>
      <view class="content">
        <view class="base u-flex u-row-left u-col-center u-p-30">
          <u-avatar
            :src="vuex_userInfo.avatar_url"
            size="140"
            @click="handleAvatarClick"
          ></u-avatar>
          <view class="u-flex-1 u-m-l-20">
            <view class="u-font-18 u-p-b-20">{{ vuex_userInfo.name }}</view>
            <view class="u-font-14 u-tips-color">邮箱:{{ vuex_userInfo.email }}</view>
          </view>
        </view>
        <view class="u-m-t-20">
          <u-cell-group>
            <u-cell-item icon="account" title="个人信息" @click="handleInfoClick"></u-cell-item>
          </u-cell-group>
        </view>
        <view class="u-m-t-20">
          <u-cell-group>
            <u-cell-item icon="order" title="所有订单" @click="handleOrderClick"></u-cell-item>
            <u-cell-item icon="star" title="图书收藏" @click="handleStarClick"></u-cell-item>
            <u-cell-item icon="map" title="收货地址" @click="handleAddressClick"></u-cell-item>
          </u-cell-group>
        </view>
        <view class="u-m-t-20">
          <u-cell-group>
            <u-cell-item icon="setting" title="设置" @click="handleSettingClick"></u-cell-item>
          </u-cell-group>
        </view>
        <view class="u-m-t-40">
          <u-button type="error" :hair-line="false" @click="isShowLogoutModal = true">
            退出
          </u-button>
        </view>
        <!-- 退出模态框 -->
        <u-modal
          show-cancel-button
          content="确定要退出吗？"
          v-model="isShowLogoutModal"
          @confirm="handleLogoutConfirm"
        ></u-modal>
      </view>
    </template>
  </view>
</template>

<script>
export default {
  name: 'ProfileCenter',
  data() {
    return {
      isShowLogoutModal: false
    }
  },
  methods: {
    async getUserInfo() {
      const userInfo = await this.$_api.user.getInfo(undefined, {
        loading: { title: '获取用户信息中' }
      })
      this.vuex('vuex_userInfo', userInfo)
    },
    handleAvatarClick() {
      if (this.vuex_userInfo.avatar_url) {
        uni.previewImage({
          current: this.vuex_userInfo.avatar_url,
          urls: [this.vuex_userInfo.avatar_url]
        })
      }
    },
    handleInfoClick() {
      this.$_router.navigateTo({
        url: '/pages/profile/info'
      })
    },
    handleOrderClick() {
      uni.showToast({
        title: '暂不支持订单查询',
        icon: 'error'
      })
    },
    handleStarClick() {
      this.$_router.navigateTo({
        url: '/pages/goods/star'
      })
    },
    handleAddressClick() {
      this.$_router.navigateTo({
        url: '/pages/address/main'
      })
    },
    handleSettingClick() {
      this.$_router.navigateTo({
        url: '/pages/profile/setting'
      })
    },
    handleLoginClick() {
      this.$_router.navigateTo({
        url: '/pages/auth/login'
      })
    },
    async handleLogoutConfirm() {
      // await this.$_api.auth.logout(undefined, {
      //   loading: { title: '退出中', mask: true },
      //   toast: { title: '退出成功', mask: true }
      // })
      // this.vuex('vuex_token', '')
      // this.vuex('vuex_userInfo', {})
      // setTimeout(() => {
      //   this.$_router.reLaunch({
      //     url: '/pages/profile/center'
      //   })
      // }, 1500)

      uni.showLoading({
        title: '退出中',
        mask: true
      })
      setTimeout(() => {
        this.vuex('vuex_token', '')
        this.vuex('vuex_userInfo', {})
        uni.hideLoading()
        this.$_router.reLaunch({
          url: '/pages/profile/center'
        })
      }, 1500)
    }
  },
  async onShow() {
    if (this.vuex_token && !Object.keys(this.vuex_userInfo).length) {
      this.getUserInfo()
    }
  }
}
</script>

<style scoped lang="scss">
.profile-center {
  .content {
    height: calc(100vh - var(--window-top) - var(--window-bottom));
    background-color: #ededed;

    .base {
      background-color: #fff;
    }
  }
}
</style>
