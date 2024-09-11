"use client";
import { useState, useEffect } from 'react';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch('/api/todos');
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: newTodo }),
    });
    if (res.ok) {
      setNewTodo('');
      fetchTodos();
    }
  };

  const toggleTodo = async (id, completed) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    });
    if (res.ok) {
      fetchTodos();
    }
  };

  const updateTodo = async (id) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: editingText }),
    });
    if (res.ok) {
      setEditingId(null);
      fetchTodos();
    }
  };

  const deleteTodo = async (id) => {
    const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchTodos();
    }
  };

  const startEditing = (id, task) => {
    setEditingId(id);
    setEditingText(task);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Todo List</h1>
      <form onSubmit={addTodo} className="mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id, todo.completed)}
              className="mr-2"
            />
            {editingId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="border p-1 mr-2"
                />
                <button onClick={() => updateTodo(todo.id)} className="bg-green-500 text-white p-1 rounded mr-2">Save</button>
                <button onClick={() => setEditingId(null)} className="bg-gray-500 text-white p-1 rounded">Cancel</button>
              </>
            ) : (
              <>
                <span className={todo.completed ? 'line-through' : ''}>{todo.task}</span>
                <button onClick={() => startEditing(todo.id, todo.task)} className="ml-2 bg-yellow-500 text-white p-1 rounded">Edit</button>
                <button onClick={() => deleteTodo(todo.id)} className="ml-2 bg-red-500 text-white p-1 rounded">Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}