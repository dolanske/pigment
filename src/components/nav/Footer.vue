<script setup lang='ts'>
import { computed, ref } from 'vue'
import { whenever } from '@vueuse/shared'
import { useFile } from '../../store/file'
import { formatFileSize } from '../../js/format'

const file = useFile()

const extension = ref('')
const size = ref(0)

whenever(() => file.img, async (img) => {
  const res = await fetch(img.src)
  res.blob()
    .then((blob) => {
      extension.value = blob.type.split('/')[1]
      size.value = blob.size
    })
})

const width = computed(() => file?.img?.naturalWidth ?? 0)
const height = computed(() => file?.img?.naturalHeight ?? 0)
</script>

<template>
  <footer class="footer">
    <p>
      <strong>X:35</strong>
      &nbsp;
      <strong>Y:512</strong>
    </p>

    <div class="flex-1" />

    <strong>{{ extension }}</strong>
    <p>
      Original
      <strong>{{ width }}</strong>x<strong>{{ height }}</strong>
    </p>

    <!-- <p>
      Modified
      <strong>1250</strong>x<strong>1250</strong>
    </p> -->

    <p>
      File
      <strong>{{ formatFileSize(size, true) }}</strong>
    </p>
  </footer>
</template>
