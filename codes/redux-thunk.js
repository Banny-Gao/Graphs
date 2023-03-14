export const thunk =
  ({ getState }) =>
  nextDispatch =>
  action => {
    if (typeof action === 'function') return action(nextDispatch, getState)

    return nextDispatch(action)
  }
