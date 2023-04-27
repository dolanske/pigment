import { defineStore } from 'pinia'

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

export const useHistory = defineStore('history', () => {

})
