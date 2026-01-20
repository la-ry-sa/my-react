import './App.css';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import { useState } from 'react';
import TodoListItem from './TodoListItem';

function App() {
  const [todoList, setTodoList] = useState([]);

  function addTodo(title) {
    const newTodo = { id: Date.now(), title: title, isCompleted: false };
    setTodoList([...todoList, newTodo]);
  }

  function completeTodo(id) {
    const completedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });
    setTodoList(completedTodos);
  }

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
    </div>
  );
}

export default App;
