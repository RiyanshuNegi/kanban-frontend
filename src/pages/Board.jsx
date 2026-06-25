import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import TaskModal from '../components/ui/TaskModal';

export default function Board() {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // Tracks the task being edited

  useEffect(() => {
    fetchBoardData();
  }, []);

  const fetchBoardData = async () => {
    try {
      const [taskRes, userRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/users')
      ]);
      setTasks(taskRes.data.data.tasks); 
      setUsers(userRes.data.data.users);
    } catch (err) {
      if (err.response?.status === 401) logout();
      setError('Failed to load system data.');
    } finally {
      setLoading(false);
    }
  };

  // Handles BOTH Creating and Editing based on whether editingTask has data
  const handleModalSubmit = async (taskData) => {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, taskData);
      } else {
        await api.post('/tasks', taskData);
      }
      setIsModalOpen(false); 
      setEditingTask(null);
      fetchBoardData(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('WARNING: Are you sure you want to delete this task permanently?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        fetchBoardData();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task.');
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setError(''); 
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      fetchBoardData(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Permission denied.');
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const getTasksByStatus = (status) => tasks.filter(task => task.status === status);

  if (loading) return <div className="font-mono text-center mt-10 font-bold uppercase">Loading Board...</div>;

  return (
    <div className="h-full flex flex-col flex-grow">
      {/* Responsive Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b-4 border-gray-900 pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Active Operations</h2>
          <p className="font-mono text-gray-600 font-bold text-sm sm:text-base">
            Logged in as: <span className="text-gray-900 uppercase">{user?.role}</span>
          </p>
        </div>
        
        {user?.role === 'manager' && (
          <button 
            onClick={openCreateModal}
            className="bg-gray-900 text-white px-6 py-2 font-bold uppercase border-2 border-gray-900 hover:bg-white hover:text-gray-900 transition-colors w-full sm:w-auto"
          >
            + New Task
          </button>
        )}
      </div>

      {error && <div className="bg-red-100 border-2 border-red-900 text-red-900 p-3 mb-4 font-mono font-bold text-sm">{error}</div>}

      {/* Responsive Grid: 1 col on mobile, 3 cols on desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-grow">
        
        {/* To Do Column */}
        <div className="bg-gray-200 border-4 border-gray-900 flex flex-col h-full min-h-[400px]">
          <div className="bg-gray-900 text-white font-black uppercase p-3 border-b-4 border-gray-900">
            To Do ({getTasksByStatus('todo').length})
          </div>
          <div className="p-3 sm:p-4 flex flex-col gap-4 overflow-y-auto">
            {getTasksByStatus('todo').map(task => (
              <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} currentUser={user} onDelete={handleDeleteTask} onEdit={openEditModal} />
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-gray-200 border-4 border-gray-900 flex flex-col h-full min-h-[400px]">
          <div className="bg-blue-600 text-white font-black uppercase p-3 border-b-4 border-gray-900">
            In Progress ({getTasksByStatus('in_progress').length})
          </div>
          <div className="p-3 sm:p-4 flex flex-col gap-4 overflow-y-auto">
            {getTasksByStatus('in_progress').map(task => (
              <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} currentUser={user} onDelete={handleDeleteTask} onEdit={openEditModal} />
            ))}
          </div>
        </div>

        {/* Done Column */}
        <div className="bg-gray-200 border-4 border-gray-900 flex flex-col h-full min-h-[400px]">
          <div className="bg-green-600 text-white font-black uppercase p-3 border-b-4 border-gray-900">
            Done ({getTasksByStatus('done').length})
          </div>
          <div className="p-3 sm:p-4 flex flex-col gap-4 overflow-y-auto">
            {getTasksByStatus('done').map(task => (
              <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} currentUser={user} onDelete={handleDeleteTask} onEdit={openEditModal} />
            ))}
          </div>
        </div>
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }} 
        onSubmit={handleModalSubmit} 
        users={users}
        initialData={editingTask} 
      />
    </div>
  );
}

// Subcomponent for the individual cards
function TaskCard({ task, onStatusChange, currentUser, onDelete, onEdit }) {
  const priorityColor = 
    task.priority === 'high' ? 'bg-red-500' : 
    task.priority === 'medium' ? 'bg-yellow-400' : 'bg-gray-300';

  const isAssignedToMe = task.assignedTo && task.assignedTo._id === currentUser.id;
  const canMoveAndEdit = currentUser.role === 'manager' || isAssignedToMe;
  const canDelete = currentUser.role === 'manager';

  return (
    <div className="bg-white border-2 border-gray-900 p-4 shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-base sm:text-lg leading-tight uppercase pr-2">{task.title}</h3>
        <span className={`w-3 h-3 border-2 border-gray-900 rounded-full shrink-0 ml-2 ${priorityColor}`} title={`Priority: ${task.priority}`}></span>
      </div>
      
      <p className="font-mono text-sm text-gray-700 mb-3 break-words">
        {task.description}
      </p>
      
      {task.assignedTo && (
        <div className="text-xs font-mono font-bold bg-gray-100 border border-gray-900 px-2 py-1 inline-block mb-3">
          Assignee: {task.assignedTo.name}
        </div>
      )}

      {canMoveAndEdit && (
        <div className="border-t-2 border-gray-200 pt-3 flex flex-col gap-2">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            className="w-full text-xs font-bold font-mono border-2 border-gray-900 p-2 bg-gray-50 cursor-pointer focus:outline-none hover:bg-gray-200 transition-colors uppercase"
          >
            <option value="todo">STATUS: TO DO</option>
            <option value="in_progress">STATUS: IN PROGRESS</option>
            <option value="done">STATUS: DONE</option>
          </select>
          
          {/* Action Buttons Container */}
          <div className="flex justify-between mt-1">
            <button 
              onClick={() => onEdit(task)}
              className="text-xs font-bold font-mono uppercase bg-gray-900 text-white px-3 py-1 hover:bg-gray-700 transition-colors"
            >
              Edit
            </button>
            {canDelete && (
              <button 
                onClick={() => onDelete(task._id)}
                className="text-xs font-bold font-mono uppercase bg-red-500 text-white px-3 py-1 hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}