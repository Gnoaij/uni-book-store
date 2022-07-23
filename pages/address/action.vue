<template>
  <view class="address-action u-p-l-30 u-p-r-30">
    <template v-if="!vuex_token">
      <u-empty
        class="u-p-80"
        mode="permission"
        color="#82848a"
        :text="addressId ? '登录之后才能编辑收货地址' : '登录之后才能新建收货地址'"
      >
        <template #bottom>
          <u-button class="u-m-t-20" size="medium" @click="handleLoginClick">登录</u-button>
        </template>
      </u-empty>
    </template>
    <template v-else>
      <u-form label-position="top" :model="form" :error-type="errorType" ref="uForm">
        <u-form-item label="姓名" required>
          <u-input v-model="form.name" type="text" placeholder="请输入姓名" />
        </u-form-item>
        <u-form-item label="手机号码" prop="phone" required>
          <u-input v-model="form.phone" type="text" placeholder="请输入手机号码" />
        </u-form-item>
        <u-form-item label="所在地区" required>
          <view class="u-flex-1" :class="form.region ? '' : 'tips'" @click="isShowRegion = true">
            {{ form.region ? form.region : '请选择所在地区' }}
          </view>
        </u-form-item>
        <u-form-item label="详细地址" required>
          <u-input v-model="form.detail" type="textarea" placeholder="请输入详细地址" auto-height />
        </u-form-item>
        <u-form-item label="默认" label-position="left">
          <u-switch v-model="form.isDefault"></u-switch>
        </u-form-item>
      </u-form>
      <view class="u-m-t-40">
        <u-button type="primary" :disabled="disabled" @click="handleSaveClick">保存</u-button>
      </view>
      <u-picker mode="region" v-model="isShowRegion" @confirm="handleRegionConfirm"></u-picker>
    </template>
  </view>
</template>

<script>
export default {
  name: 'AddressAction',
  data() {
    return {
      addressId: '',
      form: {
        name: '',
        phone: '',
        region: '',
        detail: '',
        isDefault: false
      },
      rules: {
        phone: [
          {
            validator: (rule, value, callback) => {
              return this.$u.test.mobile(value)
            },
            message: '请输入正确的手机号码',
            trigger: ['blur']
          }
        ]
      },
      errorType: ['message'],
      isShowRegion: false
    }
  },
  computed: {
    disabled() {
      return !this.form.name || !this.form.phone || !this.form.region || !this.form.detail
    }
  },
  methods: {
    async getAddress() {
      const res = await this.$_api.address.getInfo(
        { id: this.addressId },
        {
          loading: {
            title: '获取收货地址中'
          }
        }
      )
      this.form = {
        name: res.name,
        phone: res.phone,
        region: res.province + '-' + res.city + '-' + res.county,
        detail: res.address,
        isDefault: res.is_default ? true : false
      }
    },
    async addAddress() {
      const temp = this.form.region.split('-')
      const data = {
        name: this.form.name,
        phone: this.form.phone,
        address: this.form.detail,
        is_default: this.form.isDefault ? 1 : 0,
        province: temp[0],
        city: temp[1],
        county: temp[2]
      }
      await this.$_api.address.add(data, {
        loading: {
          title: '新建收货地址中',
          mask: true
        },
        toast: {
          title: '新建收货地址成功',
          mask: true
        }
      })
      setTimeout(() => {
        this.$_router.navigateBack()
      }, 1500)
    },
    async updateAddress() {
      const temp = this.form.region.split('-')
      const data = {
        id: this.addressId,
        name: this.form.name,
        phone: this.form.phone,
        address: this.form.detail,
        is_default: this.form.isDefault ? 1 : 0,
        province: temp[0],
        city: temp[1],
        county: temp[2]
      }
      await this.$_api.address.updateInfo(data, {
        loading: {
          title: '编辑收货地址中',
          mask: true
        },
        toast: {
          title: '编辑收货地址成功',
          mask: true
        }
      })
      setTimeout(() => {
        this.$_router.navigateBack()
      }, 1500)
    },
    handleRegionConfirm(event) {
      this.form.region = event.province.label + '-' + event.city.label + '-' + event.area.label
    },
    handleSaveClick() {
      this.$refs.uForm.validate(valid => {
        if (valid) {
          if (this.addressId) {
            this.updateAddress()
          } else {
            this.addAddress()
          }
        }
      })
    },
    handleLoginClick() {
      this.$_router.navigateTo({
        url: '/pages/auth/login'
      })
    }
  },
  onLoad(options) {
    if (options.id) {
      this.addressId = options.id
      uni.setNavigationBarTitle({
        title: '编辑收货地址'
      })
    } else {
      uni.setNavigationBarTitle({
        title: '新建收货地址'
      })
    }
  },
  onShow() {
    if (this.vuex_token && this.addressId) {
      this.getAddress()
    }
    if (this.$refs.uForm) {
      this.$refs.uForm.setRules(this.rules)
    }
  },
  onReady() {
    if (this.$refs.uForm) {
      this.$refs.uForm.setRules(this.rules)
    }
  }
}
</script>

<style scoped lang="scss">
.address-action {
  .tips {
    color: #c0c4cc;
  }
}
</style>
