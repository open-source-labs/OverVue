/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable consistent-return */
// eslint-disable-next-line max-len
/* we have to do a search because undo/redo saves payloads as deep clones so passing a memory ref would be detrimental
This will find you the actual object by ID
*/
const breadthFirstSearch = (array, id) => {
  const queue = [...array.filter(el => typeof el === 'object')]
  while (queue.length) {
    const evaluated = queue.shift()
    if (evaluated.id === id) {
      return evaluated
    }
    if (evaluated.children.length) {
      queue.push(...evaluated.children)
    }
  }
}

// this would find you the parent of a given id
const breadthFirstSearchParent = (array, id) => {
  const queue = [...array.filter(el => typeof el === 'object')]
  while (queue.length) {
    const evaluated = queue.shift()
    for (let i = 0; i < evaluated.children.length; i++) {
      if (evaluated.children[i].id === id) {
        return {
          evaluated,
          index: i
        }
      }
      if (evaluated.children.length) {
        queue.push(...evaluated.children)
      }
    }
  }
}

export { breadthFirstSearch, breadthFirstSearchParent }
