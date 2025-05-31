import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  // Fetch tasks
  async function fetchTasks() {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title cannot be empty');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error('Failed to add task');
      const newTask = await res.json();
      setTasks([newTask, ...tasks]);
      setTitle('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  // Toggle completed status
  async function toggleCompleted(id, completed) {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });
      if (!res.ok) throw new Error('Failed to update task');
      const updatedTask = await res.json();
      setTasks(tasks.map(t => (t._id === id ? updatedTask : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  // Delete task
  async function deleteTask(id) {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  // Start editing task
  function startEditing(id, currentTitle) {
    setEditTaskId(id);
    setEditTitle(currentTitle);
  }

  // Cancel editing
  function cancelEditing() {
    setEditTaskId(null);
    setEditTitle('');
  }

  // Submit edit update
  async function submitEdit(id) {
    if (!editTitle.trim()) {
      setError('Task title cannot be empty');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle }),
      });
      if (!res.ok) throw new Error('Failed to update task');
      const updatedTask = await res.json();
      setTasks(tasks.map(t => (t._id === id ? updatedTask : t)));
      cancelEditing();
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div className="loading">Loading tasks...</div>;

  return (
    <div className="app-container">
      <div className="todo-app">
        <h1>To-Do List</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            placeholder="Enter new task..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="task-input"
          />
          <button type="submit" className="add-btn">
            Add Task
          </button>
        </form>

        {tasks.length === 0 ? (
          <div className="empty-state">No tasks yet! Add one above.</div>
        ) : (
          <ul className="task-list">
            {tasks.map(task => (
              <li key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <div className="task-content">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleCompleted(task._id, task.completed)}
                    className="task-checkbox"
                  />

                  {editTaskId === task._id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') submitEdit(task._id);
                        if (e.key === 'Escape') cancelEditing();
                      }}
                      className="edit-input"
                      autoFocus
                    />
                  ) : (
                    <span 
                      className="task-text"
                      onDoubleClick={() => startEditing(task._id, task.title)}
                    >
                      {task.title}
                    </span>
                  )}
                </div>

                <div className="task-actions">
                  {editTaskId === task._id ? (
                    <>
                      <button 
                        onClick={() => submitEdit(task._id)}
                        className="save-btn"
                      >
                        Save
                      </button>
                      <button 
                        onClick={cancelEditing}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => startEditing(task._id, task.title)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteTask(task._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;