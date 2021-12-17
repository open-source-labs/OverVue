
<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue';
const deepEqual = require('lodash.isequal')
const cloneDeep = require('lodash.clonedeep')
const throttle = require('lodash.throttle')
import { defaultState } from './store/state/index.js'

// use this to make sure these actions don't count as things you "undo"
const ignoredActions = new Set([
  'setActiveComponent',
  'setActiveLayer',
  'upOneLayer',
  'setActiveHTML',
  'updateComponentNameInputValue'
])

let redoMixin = {
  data () {
    return {
      doneAction: [],
      undoneAction: [],
      isTimetraveling: false,
      initialState: {}
    }
  },
  created () {
    this.$store.subscribeAction((action, state) => {
      // console.log("We are saving this action!", action)
      if (typeof action.payload === 'object') {
        // console.log("We saved the world with a deepclone!", action.payload === cloneDeep)
        action.payload = cloneDeep(action.payload)
      }
      this.doneAction.push(action)
      // console.log('this is the action we are logging',action)
      // console.log('this is in our redo queue', this.undoneAction[this.undoneAction.length-1])
      // console.log("Are these equal to each other?", action == this.undoneAction[this.undoneAction.length-1])
      if (!this.isTimetraveling) {
        if (this.undoneAction[this.undoneAction.length - 1]) {
          if (
            action.type ===
              this.undoneAction[this.undoneAction.length - 1].type &&
            deepEqual(
              action.payload,
              this.undoneAction[this.undoneAction.length - 1].payload
            )
          ) {
            this.undoneAction.pop()
          } else {
            this.undoneAction = []
          }
        }
      }
    })
  },
  // undo + redo function calling
  // metaKey accounts for Command Key on Mac
  mounted () {
    const throttledUndo = throttle(this.undo, 300)
    const throttledRedo = throttle(this.redo, 300)
    // undo function calling
    window.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault()
        throttledUndo()
      }
    })
    // redo function calling
    window.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
        event.preventDefault()
        throttledRedo()
      }
    })

    this.initialState = defaultState(this.$store.state)
  },

  methods: {
    undo: function () {
      if (this.doneAction.length === 0) {
        return
      }

      this.isTimetraveling = true

      let undone = this.doneAction.pop()

      /* assuming we have have something to undo, we check if we are undoing an action that has no feedback
        e.g.: changing active elements or active components or going up and down a layer since these can be obscured from immediate feedback.
        these will feel bad to undo (imagine someone clicking around out of boredom and then deciding to undo
        this will force them to have to undo the 30 highlights they just did instead of the last "Real" action)
        if this happens we keep popping the doneAction queue and building up the redo queue. */
      if (undone !== undefined) {
        this.undoneAction.push(undone)
        if (ignoredActions.has(undone.type)) {
          // console.log('We undid an ignored action!')
          while (
            this.doneAction[this.doneAction.length - 1] &&
            ignoredActions.has(this.doneAction[this.doneAction.length - 1].type)
          ) {
            this.undoneAction.push(this.doneAction.pop())
          }
          /* if we get here, that means we have undone all "useless" actions
          so we have to do one more final pop and push, have to make sure it isn't null though */
          let finalPop = this.doneAction.pop()
          if (finalPop !== undefined) {
            this.undoneAction.push(finalPop)
          }
        }
      }

      let payload = {
        initialState: this.initialState,
        store: this.$store
      }
      this.$store.commit('EMPTY_STATE', payload)
      this.doneAction.forEach(action => {
        // console.log('in the undo loop', this.$store)
        this.$store.dispatch(action.type, cloneDeep(action.payload))
        this.doneAction.pop()
      })
      this.isTimetraveling = false
    },

    redo: function () {
      let action = this.undoneAction.pop()

      // we have to set timeTraveling to true to preserve the undoneAction array while we make changes
      this.isTimetraveling = true
      if (action) {
        this.$store.dispatch(action.type, cloneDeep(action.payload))
      }
      this.isTimetraveling = false
      if (action && ignoredActions.has(action.type)) {
        // console.log('in the redo loop')
        this.redo()
      }
    }
  }
}

export default defineComponent({
  name: 'App', 
  mixins: [redoMixin]
})
</script>

