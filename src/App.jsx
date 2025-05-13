import { useState, useEffect } from 'react'
import './App.css'
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import SortableTodoItem from './components/SortableTodoItem';


function App() {

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");


  const getTodos = async () => {
    
    const response = await fetch('https://back-todo-production.up.railway.app/')
    const todos = await response.json();
    setTodos(todos)
  }

  useEffect(() => {
    getTodos();
  }, []);

  useEffect(() => {
  localStorage.setItem('todos', JSON.stringify(todos));
}, [todos]);

  const addTodo = async (title) => {
    const response = await fetch('https://back-todo-production.up.railway.app/', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
    const todo = await response.json();
    setTodos((prevTodos) => [...prevTodos, todo]);
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;
    await addTodo(title);
    setTitle("");
  };


  const removeTodo = async (id) => {
    const response = await fetch(`https://back-todo-production.up.railway.app/${Number(id)}`, {
      method: "DELETE",
    });
    if (response.status !== 200) {
      return alert("Something went wrong");
    }
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  const updateTodo = async (id) => {

    const response = await fetch(`https://back-todo-production.up.railway.app/${id}`, {
      method: "PUT",
    });
    if (response.status !== 200) {
      return alert("Something went wrong");
    }

    setTodos(todos.map((todo) => {
      if (todo.id === id) {
        todo.done = !todo.done;
      }
      return todo;
    })
    );
  }

  const clearCompleted = async () => {
    const response = await fetch('https://back-todo-production.up.railway.app/clear-completed', {
      method: "DELETE",
    });

    if (response.status !== 200) {
      return alert("Something went wrong while clearing completed todos");
    }


    const data = await response.json();
    setTodos(data.todos);
  }
  const updateFilterStyles = (selectedFilter) => {
    const filters = ["all", "active", "completed"];

    filters.forEach(filter => {
      const element = document.getElementById(filter);
      if (element) {
        element.style.color = filter === selectedFilter ? "var(--BrightBlue)" : "var(--lastLabelFonts)";
      }
    });
  };
  const filterTodos = (filter) => {

    updateFilterStyles(filter);

    if (filter === "all") {
      return todos;
    } else if (filter === "active") {
      return todos.filter((todo) => !todo.done);
    } else if (filter === "completed") {
      return todos.filter((todo) => todo.done);
    } else {
      return todos;
    }

  };

  const activeLight = () => {
    document.body.classList.add('light-mode')


  }

  const activeDark = () => {
    document.body.classList.remove('light-mode')

  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    setTodos((todo) => {
      const oldIndex = filterTodos(filter).findIndex(task => task.id === active.id)
      const newIndex = filterTodos(filter).findIndex(task => task.id === over.id)
      return arrayMove(todo, oldIndex, newIndex)

    })
  }


  return (
    <>

      <main>
        <div className='header-section'>
          <h1>Todo</h1>
          <button id='theme-switch'>
            <img onClick={activeLight} src="images/icon-sun.svg" alt="" />
            <img onClick={activeDark} src="images/icon-moon.svg" alt="" />
          </button>


        </div>

        <form className="new-todo-container" onSubmit={handleSubmit}>
          <button className='submit-button' type='submit'>

          </button>

          <input type="text"
            className="new-todo"
            placeholder="Create new to do..."
            value={title}
            onChange={(e) => setTitle(e.target.value)} />
        </form>

        <ul className='todo-list'>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>


            <SortableContext items={todos.map(t => t.id)} strategy={verticalListSortingStrategy}>
              {filterTodos(filter).map((todo) => (
                
                  <SortableTodoItem
                    key={todo.id}
                    todo={todo}
                    updateTodo={updateTodo}
                    removeTodo={removeTodo}
                  
                  />
             
              ))}
            </SortableContext>
          </DndContext>


          <li className="last-label">
            <span>{todos.length} items left</span>
            <button className='action-button' onClick={clearCompleted}> Clear Completed</button>
          </li>

        </ul>

        <ul>
          <li className="button-label">
            <button className="action-button" id='all' onClick={() => setFilter("all")}>
              All
            </button>
            <button className="action-button" id='active' onClick={() => setFilter("active")}>
              Active
            </button>
            <button className="action-button" id='completed' onClick={() => setFilter("completed")}>
              Completed
            </button>
          </li>
        </ul>



        <p className='drag-n-drop'>Drag and drop to reorder</p>



      </main>


    </>
  )
}

export default App