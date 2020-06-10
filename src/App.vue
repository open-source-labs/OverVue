<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { SET_ACTIVE_COMPONENT } from './store/types'
const deepEqual = require('lodash.isequal')
const cloneDeep = require('lodash.clonedeep')
import { defaultState } from './store/state/index.js'

let redoMixin = {
  data () {
    return {
      // banana:[],
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
          if (action.type == this.undoneAction[this.undoneAction.length - 1].type &&
            deepEqual(action.payload, this.undoneAction[this.undoneAction.length - 1].payload)) {
            this.undoneAction.pop()
          } else {
            this.undoneAction = []
          }
        }
      }
    })
    //  this.blankState = cloneDeep(this.$store)
  },

  mounted () {
    window.addEventListener('keydown', event => {
      if (event.ctrlKey && event.key === 'z') {
        event.preventDefault()
        this.undo()
      }
    })
    window.addEventListener('keydown', event => {
      if (event.ctrlKey && event.key === 'y') {
        event.preventDefault()
        this.redo()
      }
    })

    // window.addEventListener('keydown', event => {
    //   if (event.ctrlKey && event.key === 'a') {
    //     event.preventDefault()
    //     if (this.$store.state.activeHTML !== '') {
    //       this.$store.dispatch('setActiveLayer', {id:this.$store.state.activeHTML, text:"banana"})
    //     }
    //   }
    // });
    // window.addEventListener('keydown', event => {
    //   if (event.ctrlKey && event.key === 'd') {
    //     event.preventDefault()
    //     if (this.$store.state.activeLayer.id !== '') {
    //       this.$store.dispatch('upOneLayer', this.$store.state.activeLayer.id)
    //     }
    //   }
    // });

    // console.log("do we want this? or this.$store.state?", this.$store.state)
    this.initialState = defaultState(this.$store.state)
  },

  methods: {
    undo: function () {
      // do {
      // console.log("How far back?")

      this.isTimetraveling = true

      let undone = this.doneAction.pop()

      if (undone !== undefined) {
        this.undoneAction.push(undone)
        if (undone.type === 'setActiveComponent') {
          // console.log('We did something useless!')
          do {
            this.undoneAction.push(this.doneAction.pop())
          }
          while (this.doneAction[this.doneAction.length - 1] &&
          (this.doneAction[this.doneAction.length - 1].type === 'setActiveComponent'))
        }
      }

      //  while (this.doneAction[this.doneAction.length-1] &&
      //   (this.doneAction[this.doneAction.length - 1].type === "setActiveComponent" ||
      //    this.doneAction[this.doneAction.length - 1].type === "updateComponentPosition" ))
      let payload = {
        initialState: this.initialState,
        store: this.$store
      }
      this.$store.commit('EMPTY_STATE', payload)
      this.doneAction.forEach(action => {
        // console.log('In the loop', this.$store)
        // this.$store.commit(`${mutation.type}`, mutation.payload);
        this.$store.dispatch(action.type, cloneDeep(action.payload))
        this.doneAction.pop()
      })
      this.isTimetraveling = false
    },
    redo: function () {
      let action = this.undoneAction.pop()
      this.isTimetraveling = true
      if (action) {
        this.$store.dispatch(action.type, cloneDeep(action.payload))
      }
      this.isTimetraveling = false
      if (action && (action.type === 'setActiveComponent')) {
        console.log('WE GOTTA DO MORE')
        this.redo()
      }
    }

  }
}

export default {
  name: 'App',
  mixins: [redoMixin]
}
</script>

<style>
</style>
