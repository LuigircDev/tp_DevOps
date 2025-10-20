import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// --- Íconos SVG ---
// Definidos fuera del componente principal para evitar que se re-creen en cada renderizado.

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 h-5 w-5">
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

const CheckIcon = () => (
  <motion.svg initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.3 }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check h-5 w-5">
      <path d="M20 6 9 17l-5-5"/>
  </motion.svg>
);

// Componente Principal de la Aplicación
function App() {
  // Estado para almacenar la lista de tareas, el estado de carga y los errores
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  
  // --- URL de la API del Backend ---
  // Esta URL apunta al proxy configurado
  const API_URL = '/api/todos';

  // Efecto para obtener las tareas del backend cuando el componente se monta
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('No se pudo conectar con el servidor. Intenta de nuevo más tarde.');
        }
        const data = await response.json();
        // Asegurarse de que 'completed' sea un booleano
        const formattedTodos = data.map(todo => ({...todo, completed: !!todo.completed}));
        setTodos(formattedTodos);
        setError(null);
      } catch (err) {
        setError(err.message);
        setTodos([]); // Limpiar las tareas en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []); // El array vacío asegura que esto se ejecute solo una vez

  // Función para añadir una nueva tarea
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || isAdding) {
      return; // Prevenir añadir tareas vacías o duplicadas
    }
    
    setIsAdding(true);
    setAddSuccess(false);

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
      setInput(''); // Limpiar el campo de entrada después de añadir
      setAddSuccess(true);
      // Reiniciar los estados después de que la animación de éxito se complete
      setTimeout(() => {
        setIsAdding(false);
        setAddSuccess(false);
      }, 1500);
    } catch (err) {
      console.error("Error al añadir la tarea:", err);
      setIsAdding(false); // Reiniciar en caso de error
    }
  };

  // Función para cambiar el estado de completado de una tarea
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
       console.error("Error al cambiar el estado de la tarea:", err);
    }
  };

  // Función para eliminar una tarea
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
        console.error("Error al eliminar la tarea:", err);
     }
  };

  // Función auxiliar para renderizar el contenido de la lista
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

    return (
      <AnimatePresence mode="popLayout">
        {todos.map((todo) => (
          <motion.div
            key={todo.id}
            layout
            transition={{ 
                layout: { type: "spring", stiffness: 600, damping: 40 },
                opacity: { duration: 0.2 } 
            }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={`flex items-start justify-between bg-slate-700 p-4 rounded-lg ${
              todo.completed ? 'opacity-50' : ''
            }`}
          >
            <div
              className="flex items-start gap-3 cursor-pointer flex-grow"
              onClick={() => handleToggleComplete(todo.id)}
            >
              <motion.div
                className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mt-1 ${ // Añadido flex-shrink-0 para evitar que se deforme
                  todo.completed ? 'border-green-400 bg-green-400' : 'border-slate-500'
                } flex items-center justify-center transition-all duration-300`}
                layout
                transition={{ type: "tween", duration: 0.3 }}
              >
                {todo.completed && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </motion.svg>
                )}
              </motion.div>
              <span
                className={`text-slate-200 break-words ${ // `break-words` para manejar texto largo
                  todo.completed ? 'line-through text-slate-400' : ''
                }`}
              >
                {todo.title}
              </span>
            </div>
            <motion.button
              onClick={() => handleDeleteTodo(todo.id)}
              className="text-slate-500 hover:text-red-500 transition-colors duration-300 ml-4 flex-shrink-0 mt-1"
              aria-label="Eliminar tarea"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <TrashIcon />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen flex items-center justify-center font-sans text-white p-4">
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <motion.div 
          layout
          transition={{ type: "spring", stiffness: 600, damping: 30 }}
          className="bg-slate-800 rounded-xl shadow-2xl p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Lista de Tareas
            </h1>
            <p className="text-slate-400 mt-2">Organiza tu día, una tarea a la vez.</p>
          </div>

          <form onSubmit={handleAddTodo} className="flex gap-3 mb-8">
            <div className={`flex-grow p-0.5 rounded-lg animated-gradient-border transition-all duration-300 ${isInputFocused ? 'input-glow' : ''}`}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder="Añadir nueva tarea..."
                  maxLength="100"
                  className="w-full bg-slate-700 text-white rounded-[7px] px-4 py-2 focus:outline-none"
                />
            </div>
            <motion.button
              type="submit"
              disabled={isAdding}
              className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg shimmer-button flex items-center justify-center w-28"
              whileHover={{ scale: isAdding ? 1 : 1.05 }}
              whileTap={{ scale: isAdding ? 1 : 0.95 }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={isAdding ? (addSuccess ? "success" : "loading") : "add"}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isAdding ? (addSuccess ? <CheckIcon /> : "...") : "Añadir"}
                    </motion.span>
                </AnimatePresence>
            </motion.button>
          </form>

          <motion.div layout className="space-y-4">
            {renderTodoList()}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;

