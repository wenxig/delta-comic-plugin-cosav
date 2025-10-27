<script setup lang='ts'>
import { jm } from '@/api'
import { jmStore } from '@/store'
import { Utils } from 'delta-comic-core'
import { shallowRef } from 'vue'

const isSubmitting = shallowRef(false)
const submit = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  const loading = Utils.message.createLoadingMessage('上传中')
  if (!jmStore.useredit.value) return loading.fail('无信息')
  jmStore.useredit.value.password = jmStore.useredit.value.password_confirm = jmStore.loginData.value.password
  await loading.bind(jm.api.user.setUser(jmStore.user.value?.id ?? 0, jmStore.useredit.value))
  isSubmitting.value = false
}
</script>

<template>
  <NForm :model="jmStore.useredit.value" label-placement="top" class="!bg-(--van-background-2) !p-3"
    v-if="jmStore.useredit.value" @submit.stop.prevent :disabled="isSubmitting">
    <NDivider title-placement="left" class="!mt-0">
      个人信息
    </NDivider>
    <NFormItem label="昵称" path="nickName">
      <NInput clearable v-model:value="jmStore.useredit.value.nickName" />
    </NFormItem>
    <NFormItem label="邮件" path="email">
      <NInput clearable v-model:value="jmStore.useredit.value.email" />
    </NFormItem>
    <div class="flex gap-1 w-full">
      <NFormItem label="姓" path="firstName">
        <NInput clearable v-model:value="jmStore.useredit.value.firstName" />
      </NFormItem>
      <NFormItem label="名" path="lastName">
        <NInput clearable v-model:value="jmStore.useredit.value.lastName" />
      </NFormItem>
    </div>
    <NDivider title-placement="left">
      辅助信息
    </NDivider>
    <NFormItem label="生日" path="nickName">
      <NDatePicker type="date" value-format="yyyy-MM-dd" clearable
        v-model:formatted-value="jmStore.useredit.value.birthday" />
    </NFormItem>
    <NFormItem label="结婚状态" path="relations">
      <NRadioGroup v-model:value="jmStore.useredit.value.relations">
        <NRadio label="hideuswa" value="" />
        <NRadio label="单身" value="Single" />
        <NRadio label="非单身" value="Taken" />
        <NRadio label="<开放>" value="Open" />
      </NRadioGroup>
    </NFormItem>
    <NFormItem label="性取向" path="sexuality">
      <NRadioGroup v-model:value="jmStore.useredit.value.sexuality">
        <NRadio label="hideuswa" value="" />
        <NRadio label="男" value="Guys" />
        <NRadio label="女" value="Girls" />
        <NRadio label="双性恋" value="Guys + Girls" />
      </NRadioGroup>
    </NFormItem>
    <NFormItem label="个人主页" path="website">
      <NInput clearable v-model:value="jmStore.useredit.value.website" />
    </NFormItem>
    <NFormItem label="出生地" path="birthPlace">
      <NInput clearable v-model:value="jmStore.useredit.value.birthPlace" />
    </NFormItem>
    <NFormItem label="居住城市" path="city">
      <NInput clearable v-model:value="jmStore.useredit.value.city" />
    </NFormItem>
    <NFormItem label="居住国家" path="country">
      <NInput clearable v-model:value="jmStore.useredit.value.country" />
    </NFormItem>
    <NFormItem label="学校" path="school">
      <NInput clearable v-model:value="jmStore.useredit.value.school" />
    </NFormItem>
    <NFormItem label="职业" path="occupation">
      <NInput clearable v-model:value="jmStore.useredit.value.occupation" />
    </NFormItem>
    <NFormItem label="关于我" path="aboutMe">
      <NInput type="textarea" clearable :maxlength="200" v-model:value="jmStore.useredit.value.aboutMe" />
    </NFormItem>
    <NDivider title-placement="left">
      偏好信息
    </NDivider>
    <NFormItem label="收藏性类别" path="collections">
      <NInput type="textarea" clearable :maxlength="200" v-model:value="jmStore.useredit.value.collections" />
    </NFormItem>
    <NFormItem label="我是这里的" path="infoHere">
      <NInput type="textarea" clearable :maxlength="200" v-model:value="jmStore.useredit.value.infoHere" />
    </NFormItem>
    <NFormItem label="最喜欢的理想性伴侣" path="ideal">
      <NInput type="textarea" clearable :maxlength="200" v-model:value="jmStore.useredit.value.ideal" />
    </NFormItem>
    <NFormItem label="我的敏感/好球区" path="erogenic">
      <NInput type="textarea" clearable :maxlength="200" v-model:value="jmStore.useredit.value.erogenic" />
    </NFormItem>
    <NFormItem label="最喜欢" path="favorite">
      <NInput type="textarea" clearable :maxlength="200" v-model:value="jmStore.useredit.value.favorite" />
    </NFormItem>
    <NFormItem label="最讨厌" path="hate">
      <NInput type="textarea" clearable :maxlength="200" v-model:value="jmStore.useredit.value.hate" />
    </NFormItem>
    <div class="mt-2">
      <NButton type="primary" @click="submit" :loading="isSubmitting" :disabled="isSubmitting">提交信息更新</NButton>
    </div>
  </NForm>
</template>