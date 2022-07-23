<template>
  <view class="auth-login u-p-80">
    <view class="title u-m-b-60">欢迎登录图书商城</view>
    <u-form label-width="0" :model="form" :error-type="errorType" ref="uForm">
      <u-form-item prop="email">
        <u-input v-model="form.email" type="text" placeholder="请输入邮箱" />
      </u-form-item>
      <u-form-item prop="password">
        <u-input v-model="form.password" type="password" placeholder="请输入密码" />
      </u-form-item>
    </u-form>
    <view class="u-m-t-30">
      <u-button type="primary" :disabled="disabled" @tap="handleSubmitClick">登录</u-button>
      <view class="u-p-14 u-text-right">
        <text class="u-font-26 u-tips-color" @tap="handleLinkClick">没有账号？去注册</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'AuthLogin',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱，例如xxx@qq.com'
          }
        ],
        password: [
          {
            pattern: /^[a-zA-Z0-9_]{6,16}$/,
            message: '密码必须为6~16个字母、数字或下划线'
          }
        ]
      },
      errorType: ['message']
    }
  },
  computed: {
    disabled() {
      if (!this.form.email || !this.form.password) {
        return true
      }
      return false
    }
  },
  methods: {
    async login() {
      const res = await this.$_api.auth.login(this.form, {
        loading: { title: '登录中', mask: true },
        toast: { title: '登录成功', mask: true }
      })
      this.vuex('vuex_token', res.access_token)
      setTimeout(() => {
        if (getCurrentPages().length > 1) {
          this.$_router.navigateBack()
        } else {
          this.$_router.reLaunch({
            url: '/pages/profile/center'
          })
        }
      }, 1500)
    },
    handleSubmitClick() {
      this.$refs.uForm.validate(valid => {
        if (valid) {
          this.login()
        }
      })
    },
    handleLinkClick() {
      this.$_router.redirectTo({
        url: '/pages/auth/register'
      })
    }
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules)
  }
}
</script>

<style scoped lang="scss">
.auth-login {
  .title {
    font-size: 60rpx;
    font-weight: 500;
  }
}
</style>
