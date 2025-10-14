import React, { useState, useEffect } from 'react';
import './App.css';

// Main App Component
function App() {
  // State to hold the list of todos, loading status, and errors
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- Backend API URL ---
  // Esta URL apunta al proxy configurado en Nginx
  const API_URL = '/api/todos';

  // Effect to fetch todos from the backend when the component mounts
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('No se pudo conectar con el servidor. Intenta de nuevo más tarde.');
        }
        const data = await response.json();
        // Asegurarse que 'completed' sea un booleano
        const formattedTodos = data.map(todo => ({...todo, completed: !!todo.completed}));
        setTodos(formattedTodos);
        setError(null);
      } catch (err) {
        setError(err.message);
        setTodos([]); // Clear todos on error
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []); // El array vacío asegura que esto se ejecute solo una vez

  // Function to add a new todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (input.trim() === '') {
      return; // Prevent adding empty todos
    }
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input }),
      });
      if (!response.ok) {
        throw new Error('No se pudo añadir la tarea.');
      }
      const newTodo = await response.json();
      setTodos([...todos, {...newTodo, completed: !!newTodo.completed}]);
      setInput(''); // Clear the input field after adding
    } catch (err) {
      console.error("Error adding todo:", err);
      // Opcional: mostrar un mensaje de error al usuario
    }
  };

  // Function to toggle the completed status of a todo
  const handleToggleComplete = async (id) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);
    if (!todoToUpdate) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todoToUpdate.completed }),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar la tarea.');
      }

      const updatedTodo = await response.json();
      setTodos(
        todos.map((todo) => (todo.id === id ? {...updatedTodo, completed: !!updatedTodo.completed } : todo))
      );
    } catch (err) {
       console.error("Error toggling todo:", err);
    }
  };

  // Function to delete a todo
  const handleDeleteTodo = async (id) => {
     try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('No se pudo eliminar la tarea.');
        }
        setTodos(todos.filter((todo) => todo.id !== id));
     } catch(err) {
        console.error("Error deleting todo:", err);
     }
  };

  // SVG Icon for the trash can
  const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 h-5 w-5">
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
  
  // Helper to render the list content
  const renderTodoList = () => {
    if (loading) {
      return <div className="text-center text-slate-400 py-6">Cargando tareas...</div>;
    }

    if (error) {
      return <div className="text-center text-red-400 py-6 bg-red-900/20 rounded-lg"><p>Error: {error}</p></div>;
    }
    
    if (todos.length === 0) {
      return (
         <div className="text-center text-slate-500 py-6">
           <p>¡Felicidades!</p>
           <p>No tienes tareas pendientes.</p>
        </div>
      );
    }

    return todos.map((todo) => (
      <div
        key={todo.id}
        className={`flex items-center justify-between bg-slate-700 p-4 rounded-lg transition-all duration-300 ${
          todo.completed ? 'opacity-50' : ''
        }`}
      >
        <div
          className="flex items-center gap-3 cursor-pointer flex-grow"
          onClick={() => handleToggleComplete(todo.id)}
        >
          <div
            className={`w-6 h-6 rounded-full border-2 ${
              todo.completed ? 'border-green-400 bg-green-400' : 'border-slate-500'
            } flex items-center justify-center transition-all duration-300`}
          >
            {todo.completed && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </div>
          <span
            className={`text-slate-200 ${
              todo.completed ? 'line-through text-slate-400' : ''
            }`}
          >
            {todo.title}
          </span>
        </div>
        <button
          onClick={() => handleDeleteTodo(todo.id)}
          className="text-slate-500 hover:text-red-500 transition-colors duration-300 ml-4"
          aria-label="Eliminar tarea"
        >
          <TrashIcon />
        </button>
      </div>
    ));
  }

  return (
    <div className="bg-slate-900 min-h-screen flex items-center justify-center font-sans text-white p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-xl shadow-2xl p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Lista de Tareas
            </h1>
            <p className="text-slate-400 mt-2">Organiza tu día, una tarea a la vez.</p>
          </div>

          <form onSubmit={handleAddTodo} className="flex gap-3 mb-8">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Añadir nueva tarea..."
              className="flex-grow bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg"
            >
              Añadir
            </button>
          </form>

          <div className="space-y-4">
            {renderTodoList()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
