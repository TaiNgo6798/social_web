
export default (state = [], action) => {
  switch (action.type) {
    case 'setPost':
      return state = action.payload
      
    case 'loadMore':
      action.payload.map(v => {
        state.push(v)
      })
      return state = [...state]
      
    default:
      return state
  }
}
