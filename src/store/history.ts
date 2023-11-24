import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { useEffects } from './effects'
import { useFile } from './file'

/**
 * History tracks what changes user made and allows them to backtrack
 *
 * Implementation:
 *
 * Everything has a base state. Each history entry stores only the state that
 * has changed. Meaning if we go back on resizing, none of the filters applied
 * in previous steps change.
 *
 * This allows us to keep things simple.
 */

export enum UpdateType {
  FILTER,
  TRANSFORM,
  NOISE,
}

interface UpdateEntry {
  type: UpdateType
  key: string
  value: number
}

interface HistoryEntry {
  // Store the canvas
  imageData: ImageData
  updates: UpdateEntry[]
}

export const useHistory = defineStore('history', () => {
  const entries = reactive<{ value: HistoryEntry[] }>({ value: [] })
  const historyIndex = ref(0)
  const isRestoring = ref(false)

  // Checks if we can move in history
  const canUndo = computed(() => !!entries.value[historyIndex.value - 1])
  const canRedo = computed(() => !!entries.value[historyIndex.value + 1])

  // Get the current history entry
  const now = computed(() => entries.value.at(historyIndex.value))

  function add(entry: HistoryEntry) {
    // Do not save new entries when restoring, as that would add a new
    // history entry of all the values being restored
    if (isRestoring.value)
      return

    entries.value.push(entry)
    historyIndex.value++
  }

  // Other stores
  const effects = useEffects()
  const file = useFile()

  function restore() {
    const savedEntry = entries.value[historyIndex.value]
    const { imageData, updates } = savedEntry

    // First restore values to UI elements
    for (const update of updates) {
      switch (update.type) {
        case UpdateType.FILTER: {
          effects.state[update.key].value = update.value
          break
        }

        case UpdateType.NOISE: {
          break
        }
      }
    }

    // Then overwrite canvas data
    file.update(imageData)
    isRestoring.value = false
  }

  function undo() {
    if (canUndo.value) {
      isRestoring.value = true
      historyIndex.value--
      restore()
    }
  }

  function redo() {
    if (canRedo.value) {
      isRestoring.value = true
      historyIndex.value++
      restore()
    }
  }

  return {
    add,
    undo,
    redo,
    now,
    canUndo,
    canRedo,
    entries,
  }
})
