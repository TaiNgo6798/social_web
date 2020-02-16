
export default (state = [], action) => {
  switch (action.type) {
    case 'setUserPost':
      return state = action.payload
      
    case 'loadMoreUP':
      action.payload.map(v => {
        state.push(v)
      })
      return state = [...state]
      
    default:
      return state
  }
}
