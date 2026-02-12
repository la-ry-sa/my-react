import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import { useState, useEffect } from 'react';
import TodoListItem from './features/TodoList/TodoListItem';
import TodosViewForm from './features/TodosViewForm';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');

  const addTodo = async (newTodo) => {
    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted,
          },
        },
      ],
    };
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    try {
      setIsSaving(true);
      const resp = await fetch(
        encodeUrl({ sortField, sortDirection }),
        options
      );
      if (!resp.ok) {
        throw new Error(resp.message || 'Failed to add todo');
      }
      const { records } = await resp.json();
      const savedTodo = {
        id: records[0].id,
        title: records[0].fields.title,
        isCompleted: records[0].fields.isCompleted ?? false,
      };
      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);

    const optimisticallyUpdatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });
    setTodoList(optimisticallyUpdatedTodos);

    const payload = {
      records: [
        {
          id,
          fields: {
            title: originalTodo.title,
            isCompleted: true,
          },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp = await fetch(
        encodeUrl({ sortField, sortDirection }),
        options
      );
      if (!resp.ok) {
        throw new Error(resp.message || 'Failed to complete todo');
      }

      const { records } = await resp.json();

      const syncedTodos = todoList.map((todo) => {
        if (todo.id === records[0].id) {
          return {
            ...todo,
            isCompleted: records[0].fields.isCompleted ?? false,
          };
        }
        return todo;
      });

      setTodoList(syncedTodos);
    } catch (error) {
      setErrorMessage(error.message);
      const revertedTodos = todoList.map((todo) => {
        if (todo.id === originalTodo.id) {
          return originalTodo;
        }
        return todo;
      });
      setTodoList(revertedTodos);
    } finally {
      setIsSaving(false);
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    try {
      setIsSaving(true);
      const resp = await fetch(
        encodeUrl({ sortField, sortDirection }),
        options
      );
      if (!resp.ok) {
        throw new Error(resp.message || 'Failed to update todo');
      }
      const { records } = await resp.json();
      const updatedTodos = todoList.map((todo) => {
        if (todo.id === records[0].id) {
          return {
            ...todo,
            title: records[0].fields.title,
            isCompleted: records[0].fields.isCompleted ?? false,
          };
        }
        return todo;
      });
      setTodoList(updatedTodos);
    } catch (error) {
      setErrorMessage(`${error.message}. Reverting todo...`);
      const revertedTodos = todoList.map((todo) => {
        if (todo.id === originalTodo.id) {
          return originalTodo;
        }
        return todo;
      });
      setTodoList(revertedTodos);
    } finally {
      setIsSaving(false);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;
  const encodeUrl = ({ sortField, sortDirection }) => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    return encodeURI(`${url}?${sortQuery}`);
  };

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const options = {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      };
      try {
        const resp = await fetch(
          encodeUrl({ sortField, sortDirection }),
          options
        );
        if (!resp.ok) {
          throw new Error(resp.message || 'Failed to fetch todos');
        }
        const { records } = await resp.json();
        const todos = records.map((record) => {
          const todo = {
            id: record.id,
            ...record.fields,
          };
          if (!todo.isCompleted) {
            todo.isCompleted = false;
          }
          return todo;
        });
        setTodoList(todos);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [sortField, sortDirection]);

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />
      <hr />
      <TodosViewForm
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
      />
      {errorMessage && (
        <div>
          <p className="error">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}

export default App;
