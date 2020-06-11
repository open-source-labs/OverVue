<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { SET_ACTIVE_COMPONENT } from './store/types'
const deepEqual = require('lodash.isequal')
const cloneDeep = require('lodash.clonedeep')
const throttle = require('lodash.throttle')
import { defaultState } from './store/state/index.js'


//use this to make sure these actions don't count as things you "undo"
const ignoredActions = new Set([
  "setActiveComponent",
  "setActiveLayer",
  "upOneLayer",
  "setActiveHTML"
  ])


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

    const throttledUndo = throttle(this.undo,300)
    const throttledRedo = throttle(this.redo,300)

    window.addEventListener('keydown', event => {
      if (event.ctrlKey && event.key === 'z') {
        event.preventDefault()
        throttledUndo()
      }
    })
    window.addEventListener('keydown', event => {
      if (event.ctrlKey && event.key === 'y') {
        event.preventDefault()
        throttledRedo()
      }
    })

    // commented code for hotkeys for debuging///////////////////////
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
    //////////////////////////////////////////////////////////////////////

    // console.log("do we want this? or this.$store.state?", this.$store.state)
    this.initialState = defaultState(this.$store.state)
  },

  methods: {
    undo: function () {
      // do {
      // console.log("How far back?")
      if(this.doneAction.length ===0){
        return
      }

      this.isTimetraveling = true

      let undone = this.doneAction.pop()

      // assuming we have have something to undo, we check if we are undoing an action that has no feedback
      // like say changing active elements or active components or going up and down a layer since these can be obscured from immediate feedback
      // will just feel bad to undo (Imagine someone just clicking around out of boredom and then deciding to undo
      // will force them to have to undo the 30 highlights they just did instead of the last "Real" action)
      // if this happens we keep popping the doneAction queue and building up the redo queue.
      if (undone !== undefined) {
        this.undoneAction.push(undone)
        if (ignoredActions.has(undone.type)) {
          // console.log('We did something useless!')
          while (this.doneAction[this.doneAction.length - 1] &&
          ignoredActions.has(this.doneAction[this.doneAction.length - 1].type)){
            this.undoneAction.push(this.doneAction.pop())
          }
           // if we get here, that means we have undone all "useless" actions 
          // so we have to do one more final pop and push, have to make sure it isn't null though
          let finalPop = this.doneAction.pop()
          if(finalPop !== undefined){
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
        //console.log('In the loop', this.$store)
        // this.$store.commit(`${mutation.type}`, mutation.payload);
        this.$store.dispatch(action.type, cloneDeep(action.payload))
        this.doneAction.pop()
      })
      this.isTimetraveling = false
    },

    redo: function () {
      let action = this.undoneAction.pop()

      //we have to set timeTraveling to true to preserve the undoneAction array while we make changes
      this.isTimetraveling = true
      if (action) {
        this.$store.dispatch(action.type, cloneDeep(action.payload))
      }
      this.isTimetraveling = false
      if (action && ignoredActions.has(action.type)) {
        //console.log('WE GOTTA DO MORE')
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
