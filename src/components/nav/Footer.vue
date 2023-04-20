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

// const { x, y } = useMouse()
// const formattedY = computed(() => Math.min(window.innerHeight - (canvas.cfg.offsetBottom + canvas.cfg.offsetTop), Math.max(0, y.value - canvas.cfg.offsetTop)))
</script>

<template>
  <footer class="footer">
    <!-- <p>
      <strong>X:{{ x }}</strong>
      &nbsp;
      <strong>Y:{{ formattedY }}</strong>
    </p> -->

    <!-- <div class="flex-1" /> -->

    <template v-if="file.img">
      <strong>{{ extension }}</strong>
      <p>
        Original
        <strong>{{ width }}</strong>x<strong>{{ height }}</strong>
      </p>
      <p>
        Scaled
        <strong>{{ Math.round(file.currentScale.width) }}</strong>x<strong>{{ Math.round(file.currentScale.height) }}</strong>
      </p>
      <p>
        File
        <strong>{{ formatFileSize(size, true) }}</strong>
      </p>
    </template>
    <p v-else>
      No file available
    </p>
  </footer>
</template>
