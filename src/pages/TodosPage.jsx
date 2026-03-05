import React from 'react';
import styles from './TodosPage.module.css';
import TodoForm from '../features/TodoForm';
import TodoList from '../features/TodoList/TodoList';
import TodosViewForm from '../features/TodosViewForm';

function TodosPage({
  onAddTodo,
  isSaving,
  todoList,
  onCompleteTodo,
  onUpdateTodo,
  isLoading,
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
  errorMessage,
}) {
  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <TodoForm onAddTodo={onAddTodo} isSaving={isSaving} />
        <TodoList
          todoList={todoList}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
          isLoading={isLoading}
        />
        <hr />
        <TodosViewForm
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          sortField={sortField}
          setSortField={setSortField}
          queryString={queryString}
          setQueryString={setQueryString}
        />
        {errorMessage && (
          <div className={styles.errorBox}>
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodosPage;
