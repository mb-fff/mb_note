<template>
  <!-- 登录框 -->
  <el-dialog
    custom-class="m-dialog-login"
    v-model="loginDialogVisible"
    title="用户登陆"
    width="22%"
    top="25vh"
    append-to-body
    :before-close="handleLoginClose"
    draggable
  >
    <div class="m-content">
      <el-form ref="loginFormRef" :model="ruleForm" status-icon :rules="rules" class="m-form-login">
        <el-form-item prop="username">
          <el-input
            v-model="ruleForm.username"
            autocomplete="off"
            placeholder="请输入用户名"
            :prefix-icon="User"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            type="password"
            autocomplete="off"
            placeholder="请输入密码"
            :prefix-icon="Lock"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="m-btn-login" type="primary" @click="submitForm(loginFormRef)">登陆</el-button>
        </el-form-item>
      </el-form>
      <p class="m-other-way">其他登陆方式</p>
      <p class="m-protocol">
        注册登陆即表示同意
        <span class="m-mark">用户协议</span>、
        <span class="m-mark">隐私政策</span>
      </p>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { ElForm } from 'element-plus'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import HttpAuth from '@/api/httpAuth'
import { LocalStorageOfTime } from '@/utils/storage'
import { useStore } from 'vuex'

const httpAuth = new HttpAuth()
const storageOfTime = new LocalStorageOfTime()
type FormInstance = InstanceType<typeof ElForm>
const loginFormRef = ref<FormInstance>()
const $store = useStore()

// 登陆表单数据
const ruleForm = reactive({
  username: '',
  password: ''
})

// 用户名校验规则
const validateUserName = (rule: any, value: string, callback: any): void => {
  value === '' ? callback(new Error('Please input the username')) : callback()
}

// 密码校验规则
const validatePassword = (rule: any, value: string, callback: any): void => {
  value === '' ? callback(new Error('Please input the password')) : callback()
}

// 表单校验规则
const rules = reactive({
  username: [{ validator: validateUserName, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }]
})

// 接收父组件props
const props = defineProps({
  loginDialogVisible: {
    type: Boolean,
    default: false
  }
})

// 向父组件传递数据emit
const emit = defineEmits(['changeVisible'])

// 登陆校验
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate((valid) => {
    if (!valid) return false
    login()
  })
}

// 发起登陆请求
const login = async () => {

  try {
    const params = {
      username: ruleForm.username,
      password: ruleForm.password
    }
    const res = await httpAuth.login(params)
    const { token } = res.data.data
    storageOfTime.set('mb_note_token', token)
    $store.commit('SET_LOGIN_STATUS', true)
    emit('changeVisible', false)
    // 登陆成功
    ElMessage.success('登陆成功')
  } catch (error) {
    ElMessage.error('登陆失败')
  }

}

// 关闭登录框
const handleLoginClose = (): void => {
  emit('changeVisible', false)
}
</script>

<style lang='scss' scoped>
</style>
