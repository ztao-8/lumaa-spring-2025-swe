import React, { useEffect, useState } from 'react';

interface Task {
  id: number;
  title: string;
  description?: string;
  isComplete: boolean;
}

interface TasksProps {
  token: string;
}

const Tasks: React.FC<TasksProps> = ({ token }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // For editing a task's details
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Function to fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      console.log('Fetched tasks:', data);
      if (Array.isArray(data)) {
        setTasks(data);
      } else if (data.tasks && Array.isArray(data.tasks)) {
        setTasks(data.tasks);
      } else {
        console.error('Unexpected tasks response:', data);
        setTasks([]);
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching tasks');
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to create a new task
  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
      });
      const newTask = await res.json();
      setTasks(prev => [...prev, newTask]);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
      alert('Error creating task');
    }
  };

  // Function to toggle completion status
  const toggleTaskCompletion = async (task: Task) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...task, isComplete: !task.isComplete })
      });
      const updatedTask = await res.json();
      setTasks(tasks.map(t => (t.id === task.id ? updatedTask : t)));
    } catch (err) {
      console.error(err);
      alert('Error updating task');
    }
  };

  // Function to update a task's title and description
  const updateTaskDetails = async (task: Task) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: editTitle, description: editDescription, isComplete: task.isComplete })
      });
      const updatedTask = await res.json();
      setTasks(tasks.map(t => (t.id === task.id ? updatedTask : t)));
      // Clear editing state
      setEditingTask(null);
      setEditTitle('');
      setEditDescription('');
    } catch (err) {
      console.error(err);
      alert('Error updating task details');
    }
  };

  // Function to delete a task
  const deleteTask = async (id: number) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error deleting task');
    }
  };

  return (
    <div>
      <h2>Your Tasks</h2>
      {tasks.length > 0 ? (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              {editingTask && editingTask.id === task.id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                  />
                  <input
                    type="text"
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                  />
                  <button onClick={() => updateTaskDetails(task)}>Save</button>
                  <button onClick={() => setEditingTask(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span style={{ textDecoration: task.isComplete ? 'line-through' : 'none' }}>
                    {task.title} - {task.description}
                  </span>
                  <button onClick={() => toggleTaskCompletion(task)}>
                    {task.isComplete ? 'Mark Incomplete' : 'Mark Complete'}
                  </button>
                  <button onClick={() => {
                    setEditingTask(task);
                    setEditTitle(task.title);
                    setEditDescription(task.description || '');
                  }}>Edit</button>
                  <button onClick={() => deleteTask(task.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks found.</p>
      )}

      <h3>Create New Task</h3>
      <form onSubmit={createTask}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default Tasks;
