"use client";
import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "@/core/api";
import KanbanView from "./components/KanbanView";
import TableView from "./components/TableView";
import TaskForm from "./components/TaskForm";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [filters, setFilters] = useState({
    due_date: "",
    priority: "",
    status: "",
    assigned_user: ""
  });

  // Responsive default view
  useEffect(() => {
    if (window.innerWidth < 768) setView("table");
    else setView("kanban");
  }, []);

  // Fetch tasks with filters
  const fetchTasks = async (filterParams = filters) => {
    setLoading(true);
    try {
      const params: any = {};
      if (filterParams.due_date) params.due_date = filterParams.due_date;
      if (filterParams.priority) params.priority = filterParams.priority;
      if (filterParams.status) params.status = filterParams.status;
      if (filterParams.assigned_user) params.assigned_user = filterParams.assigned_user;
      const res = await getTasks(params);
      setTasks(res.data.results || res.data);
    } catch (err: any) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchTasks(); }, []);

  // CRUD handlers
  const handleSave = async (task: any) => {
    try {
      if (task.id) await updateTask(task.id, task);
      else await createTask(task);
      setShowForm(false);
      setEditTask(null);
      fetchTasks();
    } catch {
      setError("Failed to save task");
    }
  };
  const handleEdit = (task: any) => {
    setEditTask(task);
    setShowForm(true);
  };
  const handleDelete = async (id: any) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch {
      setError("Failed to delete task");
    }
  };

  // Filtering UI
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTasks();
  };
  const handleFilterReset = () => {
    setFilters({ due_date: "", priority: "", status: "", assigned_user: "" });
    fetchTasks({ due_date: "", priority: "", status: "", assigned_user: "" });
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full p-4">
      <div className="flex flex-col sm:flex-row w-full max-w-5xl justify-between items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <div className="flex gap-2">
          <button className={`px-3 py-1 rounded ${view === "kanban" ? "bg-blue-600 text-white" : "bg-gray-700"}`} onClick={() => setView("kanban")}>Kanban</button>
          <button className={`px-3 py-1 rounded ${view === "table" ? "bg-blue-600 text-white" : "bg-gray-700"}`} onClick={() => setView("table")}>Table</button>
          <button className="bg-green-600 text-white rounded px-3 py-1" onClick={() => { setShowForm(true); setEditTask(null); }}>Add Task</button>
        </div>
      </div>
      {/* Advanced Filtering UI */}
      <div className="w-full flex justify-center mb-4">
        <form onSubmit={handleFilterSubmit} className="flex flex-wrap items-center justify-center gap-2 w-full max-w-5xl bg-gray-200 dark:bg-gray-900 p-3 rounded shadow-lg">
        <input
          type="date"
          name="due_date"
          value={filters.due_date}
          onChange={handleFilterChange}
          className="border border-gray-500 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded px-2 py-1 bg-gray-100 dark:bg-gray-800 text-white dark:text-gray-100 transition-colors"
          placeholder="Due Date"
        />
        <select
          name="priority"
          value={filters.priority}
          onChange={handleFilterChange}
          className="border border-gray-500 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded px-2 py-1 bg-gray-100 dark:bg-gray-800 text-white dark:text-gray-100 transition-colors"
        >
          <option value="">Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border border-gray-500 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded px-2 py-1 bg-gray-100 dark:bg-gray-800 text-white dark:text-gray-100 transition-colors"
        >
          <option value="">Status</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <input
          type="text"
          name="assigned_user"
          value={filters.assigned_user}
          onChange={handleFilterChange}
          className="border border-gray-500 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded px-2 py-1 bg-gray-100 dark:bg-gray-800 text-white dark:text-gray-100 transition-colors"
          placeholder="Assigned User ID"
        />
        <button type="submit" className="bg-blue-600 text-white rounded px-3 py-1">Filter</button>
        <button type="button" className="bg-gray-400 dark:bg-gray-700 text-white rounded px-3 py-1" onClick={handleFilterReset}>Reset</button>
        </form>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="w-full max-w-5xl">
          {view === "kanban" ? (
            <KanbanView tasks={tasks} onTaskUpdate={handleEdit} onTaskDelete={handleDelete} />
          ) : (
            <TableView tasks={tasks} onTaskUpdate={handleEdit} onTaskDelete={handleDelete} />
          )}
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-gray rounded shadow-lg w-full max-w-md">
            <TaskForm initial={editTask} onSave={handleSave} onCancel={() => { setShowForm(false); setEditTask(null); }} />
          </div>
        </div>
      )}
    </div>
  );
}
