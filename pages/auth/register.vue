<template>
  <view class="auth-register u-p-80">
    <view class="title u-m-b-60">欢迎注册图书商城</view>
    <u-form label-width="0" :model="form" :error-type="errorType" ref="uForm">
      <u-form-item prop="name" required>
        <u-input v-model="form.name" type="text" placeholder="请输入昵称" />
      </u-form-item>
      <u-form-item prop="email" required>
        <u-input v-model="form.email" type="text" placeholder="请输入邮箱" />
      </u-form-item>
      <u-form-item prop="password" required>
        <u-input v-model="form.password" type="password" placeholder="请输入密码" />
      </u-form-item>
      <u-form-item prop="password_confirmation" required>
        <u-input v-model="form.password_confirmation" type="password" placeholder="请确认密码" />
      </u-form-item>
    </u-form>
    <view class="u-m-t-30">
      <u-button type="primary" :disabled="disabled" @tap="handleSubmitClick">注册</u-button>
      <view class="u-p-14 u-text-right">
        <text class="u-font-26 u-tips-color" @tap="handleLinkClick">已有账号？去登录</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'AuthRegister',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      rules: {
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱，例如xxx@qq.com',
            trigger: ['blur']
          }
        ],
        password: [
          {
            pattern: /^[a-zA-Z0-9_]{6,16}$/,
            message: '密码必须为6~16个字母、数字或下划线',
            trigger: ['blur']
          }
        ],
        password_confirmation: [
          {
            validator: (rule, value, callback) => {
              return this.form.password === value
            },
            message: '密码不一致',
            trigger: ['blur']
          }
        ]
      },
      errorType: ['message']
    }
  },
  computed: {
    disabled() {
      if (
        !this.form.name ||
        !this.form.email ||
        !this.form.password ||
        !this.form.password_confirmation
      ) {
        return true
      }
      return false
    }
  },
  methods: {
    async register() {
      const res = await this.$_api.auth.register(this.form, {
        loading: { title: '注册中', mask: true },
        toast: { title: '注册成功', mask: true }
      })
      setTimeout(() => {
        this.$_router.redirectTo({
          url: '/pages/auth/login'
        })
      }, 1500)
    },
    handleSubmitClick() {
      this.$refs.uForm.validate(valid => {
        if (valid) {
          this.register()
        }
      })
    },
    handleLinkClick() {
      this.$_router.redirectTo({
        url: '/pages/auth/login'
      })
    }
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules)
  }
}
</script>

<style scoped lang="scss">
.auth-register {
  .title {
    font-size: 60rpx;
    font-weight: 500;
  }
}
</style>
