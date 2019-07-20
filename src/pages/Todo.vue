
<template>
  <div class="todo">
    <div v-if="$apollo.loading">
      <div class="text-xs-center">
        <q-circular-progress indeterminate size="50px" color="lime" class="q-ma-md"/>
      </div>
    </div>
    <form @submit.prevent.stop="onCreate" class="q-pa-md">
      <div class="q-pa-md" style="max-width: 420px">
        <q-input
          type="text"
          ref="name"
          filled
          color="teal"
          dense
          label="Name"
          clearable
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Missing name']"
          v-model="name"
        />
        <q-input
          type="text"
          ref="description"
          filled
          color="teal"
          dense
          label="Description"
          clearable
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Missing description']"
          v-model="description"
        />

        <q-input
          type="date"
          ref="date"
          filled
          dense
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Missing date']"
          v-model="date"
        >
          <template v-slot:append>
            <q-icon name="event"></q-icon>
          </template>
        </q-input>

        <div class="row center">
          <q-btn type="submit" label="Create Todo" class="todoButton">
            <template v-slot:loading>
              <q-spinner-facebook/>
            </template>
          </q-btn>
        </div>

        <ul>
          <li class="todo" v-for="(todo, index) in todos" :key="index">
            <p class="todoname">{{ todo.name }}</p>
            <p class="text">{{ todo.description }}</p>
            <p class="text">Due: {{ todo.date }}</p>
            <p
              @click="toggleComplete(todo)"
              class="text button"
            >{{ todo.completed ? 'completed' : 'not completed' }}</p>
            <p @click="deleteTodo(todo)" class="text button delete">Delete todo item</p>
          </li>
        </ul>
      </div>
    </form>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { listTodos } from '../graphql/queries'
import { createTodo, deleteTodo, updateTodo } from '../graphql/mutations'
import uuidV4 from 'uuid/v4'
import { date } from 'quasar'
export default {
  name: 'Todo',
  computed: {
    date () {
      let timeStamp = Date.now()
      let formattedString = date.formatDate(timeStamp, 'YYYY-MM-DD')
      return formattedString
    }
  },
  data () {
    return {
      name: '',
      description: '',
      owner: 'foo', // this is just a placeholder and will get updated by AppSync resolver
      user: '',
      todos: []
    }
  },
  beforeCreate () {
    this.$Auth.currentAuthenticatedUser()
      .then(user => {
        this.user = user
        this.signedIn = true
      })
      .catch(() => this.$router.push({ name: 'auth' }))
  },
  methods: {
    onCreate () {
      this.$refs.name.validate()
      this.$refs.description.validate()
      this.$refs.date.validate()
      if (this.$refs.name.hasError || this.$refs.description.hasError || this.$refs.date.hasError) {
        this.formHasError = true
        this.$q.notify({
          color: 'negative',
          message: 'Missing form fields'
        })
      } else {
        this.$q.notify({
          icon: 'done',
          color: 'positive',
          message: 'Submitted'
        })
        this.createTodo()
      }
    },
    toggleComplete (todo) {
      const updatedTodo = {
        ...todo,
        completed: !todo.completed
      }
      // graphql layers dont like __typename in our object
      delete updatedTodo.__typename
      this.$apollo.mutate({
        mutation: gql(updateTodo),
        variables: { input: updatedTodo },
        update: (store, { data: { updateTodo } }) => {
          const data = store.readQuery({ query: gql(listTodos) })
          const index = data.listTodos.items.findIndex(item => item.id === updateTodo.id)
          data.listTodos.items[index] = updateTodo
          store.writeQuery({ query: gql(listTodos), data })
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateTodo: {
            __typename: 'Todo',
            ...updatedTodo
          }
        }
      })
        .then(data => console.log(data))
        .catch(error => console.error(error))
    },
    deleteTodo (todo) {
      this.$apollo.mutate({
        mutation: gql(deleteTodo),
        variables: {
          input: { id: todo.id }
        },
        update: (store, { data: { deleteTodo } }) => {
          const data = store.readQuery({ query: gql(listTodos) })
          data.listTodos.items = data.listTodos.items.filter(todo => todo.id !== deleteTodo.id)
          store.writeQuery({ query: gql(listTodos), data })
        },
        optimisticResponse: {
          __typename: 'Mutation',
          deleteTodo: {
            __typename: 'Todo',
            ...todo
          }
        }
      })
        .then(data => console.log(data))
        .catch(error => console.error(error))
    },
    createTodo () {
      const name = this.name
      const date = this.date
      const description = this.description
      const owner = this.user.username
      const id = uuidV4()
      const todo = {
        name: name,
        id,
        date,
        owner,
        description,
        completed: false
      }
      this.$apollo.mutate({
        mutation: gql(createTodo),
        variables: { input: todo },
        update: (store, { data: { createTodo } }) => {
          const data = store.readQuery({ query: gql(listTodos) })
          data.listTodos.items.push(createTodo)
          store.writeQuery({ query: gql(listTodos), data })
        },
        optimisticResponse: {
          __typename: 'Mutation',
          createTodo: {
            __typename: 'Todo',
            ...todo
          }
        }
      })
        .then(data => console.log(data))
        .catch(error => console.error('error!!!: ', error))
    }
  },
  apollo: {
    todos: {
      query: gql(listTodos),
      update: data => data.listTodos.items
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  box-sizing: border-box;
}
.todoButton {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: #2196f3;
  border: none;
  color: white;
  outline: none;
}
.button {
  cursor: pointer;
}
.button:hover {
  opacity: 0.5;
}
.todoname {
  margin-top: 4px;
  margin-bottom: 0px;
  font-weight: bold;
}
.text {
  margin-top: 4px;
  margin-bottom: 0px;
}
.delete {
  color: #2196f3;
}
.todo {
  display: block;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  text-align: center;
  padding-top: 8px;
  padding-bottom: 9px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
</style>
view rawTodo.vue hosted with ❤ by GitHub