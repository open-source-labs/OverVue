// eslint-disable
// this is an auto generated file. This will be overwritten

export const getTodo = `query GetTodo($id: ID!) {
  getTodo(id: $id) {
    id
    name
    owner
    date
    description
    completed
  }
}
`;
export const listTodos = `query ListTodos(
  $filter: ModelTodoFilterInput
  $limit: Int
  $nextToken: String
) {
  listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      owner
      date
      description
      completed
    }
    nextToken
  }
}
`;
export const searchTodos = `query SearchTodos(
  $filter: SearchableTodoFilterInput
  $sort: SearchableTodoSortInput
  $limit: Int
  $nextToken: Int
) {
  searchTodos(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      name
      owner
      date
      description
      completed
    }
    nextToken
  }
}
`;
