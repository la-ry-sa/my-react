import React, { useEffect } from 'react';
import TodoListItem from './TodoListItem';
import styles from './TodoList.module.css';
import { useSearchParams, useNavigate } from 'react-router';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const itemsPerPage = 5; // Set for 5 instead of 15 for easier testing, can be changed back to 15 or made dynamic as needed
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const currentTodos = filteredTodoList.slice(
    indexOfFirstTodo,
    indexOfFirstTodo + itemsPerPage
  );
  const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);

  function handlePreviousPage() {
    if (currentPage > 1) {
      setSearchParams({ page: currentPage - 1 });
    }
  }

  function handleNextPage() {
    if (currentPage < totalPages) {
      setSearchParams({ page: currentPage + 1 });
    }
  }

  useEffect(() => {
    if (totalPages > 0) {
      if (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) {
        navigate('/');
      }
    }
  }, [currentPage, totalPages, navigate]);

  if (isLoading) {
    return <p>Todo list loading...</p>;
  }

  return filteredTodoList.length === 0 ? (
    <p>Add todo above to get started</p>
  ) : (
    <>
      <ul className={styles.todoList}>
        {currentTodos.map((todo) => (
          <TodoListItem
            key={todo.id}
            todo={todo}
            onCompleteTodo={onCompleteTodo}
            onUpdateTodo={onUpdateTodo}
          />
        ))}
      </ul>
      <div className={styles.paginationControls}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </>
  );
}

export default TodoList;
