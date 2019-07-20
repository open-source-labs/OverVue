// eslint-disable
// this is an auto generated file. This will be overwritten

export const getProject = `query GetProject($id: ID!) {
  getProject(id: $id) {
    id
    name
    owner
    date
    description
  }
}
`
export const listProjects = `query ListProjects(
  $filter: ModelProjectFilterInput
  $limit: Int
  $nextToken: String
) {
  listProjects(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      owner
      date
      description
    }
    nextToken
  }
}
`
export const searchProjects = `query SearchProjects(
  $filter: SearchableProjectFilterInput
  $sort: SearchableProjectSortInput
  $limit: Int
  $nextToken: Int
) {
  searchProjects(
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
    }
    nextToken
  }
}
`
