export const createStore = (reducer, preloadedState, enhancer) => {
  if (typeof enhancer === 'function') {
    return enhancer(createStore)(reducer, preloadedState)
  }

  let currentState = preloadedState
  let currentReducer = reducer
  let currentListeners = new Map()
  let nextListeners = currentListeners
  let listenerIdCounter = 0
  let isDispatching = false

  const getState = () => currentState

  const ensureCanMutateNextListeners = () => {
    if (nextListeners === currentListeners) {
      nextListeners = new Map()
      currentListeners.forEach((listener, key) => {
        nextListeners.set(key, listener)
      })
    }
  }

  const subscribe = listener => {
    let isSubscribed = true

    ensureCanMutateNextListeners()

    const listenerID = listenerIdCounter++
    nextListeners.set(listenerID, listener)

    const unsubscribe = () => {
      if (!isSubscribed || isDispatching) return

      isSubscribed = false

      ensureCanMutateNextListeners()
      nextListeners.delete(listenerID)
      currentListeners = null
    }

    return unsubscribe
  }

  const dispatch = action => {
    if (isDispatching) return

    try {
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }

    const listeners = (currentListeners = nextListeners)
    listeners.forEach(listener => {
      listener()
    })

    return action
  }

  const replaceReducer = nextReducer => {
    currentReducer = nextReducer
    dispatch({ type: 'replaceReducer' })
  }

  dispatch({ type: 'init' })

  return {
    getState,
    subscribe,
    dispatch,
    replaceReducer,
  }
}

export const combineReducers = reducers => {
  const combination = (state, action) => {
    const newState = { ...state }

    Object.entries(reducers).forEach(([key, reducer]) => {
      newState[key] = reducer(state[key], action)
    })

    return newState
  }

  return combination
}

export const bindActionCreators = (actionCreators, dispatch) =>
  Object.entries(actionCreators).reduce(
    (boundActionCreators, [key, actionCreator]) => {
      boundActionCreators[key] = (...args) => dispatch(actionCreator(...args))

      return boundActionCreators
    },
    {}
  )

export const applyMiddleWare =
  (...middleWares) =>
  createStore =>
  (reducer, preloadedState) => {
    const store = createStore(reducer, preloadedState)

    const compose = (...fns) =>
      fns.reduceRight(
        (prevFn, nextFn) =>
          (...args) =>
            nextFn(prevFn(...args)),
        value => value
      )

    const middleWareAPI = {
      getState: store.getState,
    }

    const chain = middleWares.map(middleware => middleware(middleWareAPI))
    const dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch,
    }
  }
