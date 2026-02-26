const actions = {
  //actions in useEffect that loads todos
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  //found in useEffect and addTodo to handle failed requests
  setLoadError: 'setLoadError',
  //actions found in addTodo
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',
  //found in helper functions
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',
  //reverts todos when requests fail
  revertTodo: 'revertTodo',
  //action on Dismiss Error button
  clearError: 'clearError',
};

const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return {
        ...state,
        isLoading: true,
      };
    case actions.loadTodos:
      return {
        ...state,
        todoList: action.records.map((record) => {
          const todo = {
            id: record.id,
            ...record.fields,
          };
          if (!todo.isCompleted) {
            todo.isCompleted = false;
          }
          return todo;
        }),
        isLoading: false,
      };
    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error.message,
        isLoading: false,
      };
    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
      };
    case actions.addTodo:
      const record = action.records[0];
      const savedTodo = {
        id: record.id,
        title: record.fields.title,
        isCompleted: record.fields.isCompleted ?? false,
      };
      return {
        ...state,
        savedTodo: savedTodo,
        todoList: [...state.todoList, savedTodo],
        isSaving: false,
      };
    case actions.endRequest:
      return {
        ...state,
        isLoading: false,
        isSaving: false,
      };
    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error.message,
        isLoading: false,
      };
    case actions.revertTodo:
    case actions.updateTodo:
      const updatedTodos = state.todoList.map((todo) => {
        if (todo.id === action.editedTodo.id) {
          return action.editedTodo;
        }
        return todo;
      });
      const updatedState = {
        ...state,
        todoList: updatedTodos,
      };
      if (action.error) {
        updatedState.errorMessage = action.error.message;
      }
      return updatedState;
    case actions.completeTodo:
      const optimisticallyUpdatedTodos = state.todoList.map((todo) => {
        if (todo.id === action.id) {
          return { ...todo, isCompleted: true };
        }
        return todo;
      });
      return {
        ...state,
        todoList: optimisticallyUpdatedTodos,
      };
    case actions.clearError:
      return {
        errorMessage: '',
        ...state,
      };
  }
}

export { initialState, actions, reducer };
