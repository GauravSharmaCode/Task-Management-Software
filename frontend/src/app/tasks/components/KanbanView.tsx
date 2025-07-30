import React from "react";

export default function KanbanView({ tasks, onTaskUpdate, onTaskDelete }: any) {
  // Placeholder: Render tasks in Kanban columns by status
  return (
    <div className="w-full flex gap-4 overflow-x-auto">
      {/* Map over statuses and render columns */}
      {['todo', 'in_progress', 'completed'].map(status => (
        <div
          key={status}
          className="flex-1 min-w-[250px] bg-gray-100 dark:bg-gray-800 rounded p-2"
        >
          <h2 className="font-bold capitalize mb-2 text-gray-800 dark:text-gray-100">
            {status.replace('_', ' ')}
          </h2>
          {tasks.filter((t: any) => t.status === status).map((task: any) => (
            <div
              key={task.id}
              className="bg-gray dark:bg-gray-900 rounded shadow p-2 mb-2 border border-gray-200 dark:border-gray-700"
            >
              <div className="font-semibold text-gray-900 dark:text-gray-100">{task.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Due: {task.due_date}</div>
              <div className="flex gap-2 mt-2">
                <button className="text-blue-600 dark:text-blue-400" onClick={() => onTaskUpdate(task)}>Edit</button>
                <button className="text-red-600 dark:text-red-400" onClick={() => onTaskDelete(task.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
