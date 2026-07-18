import { claimTask } from '../../api/talent';

const STATUS_CLASS = {
  Open:      'status-badge-Open',
  Claimed:   'status-badge-Claimed',
  Submitted: 'status-badge-Submitted',
  Approved:  'status-badge-Approved',
  Rejected:  'status-badge-Rejected',
};

const TaskCard = ({ task, showClaimButton = false, onClaimed }) => {

  const handleClaim = async () => {
    try {
      await claimTask(task._id);
      if (onClaimed) onClaimed();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to claim task');
    }
  };

  return (
    <div className="bg-bg-card border border-border rounded-xl p-6 flex flex-col hover-lift transition-all cursor-default h-full">

      {/* Header: title + status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-bold text-text-primary leading-tight font-display">
          {task.title || 'Untitled Task'}
        </h3>
        {task.status && (
          <span className={`shrink-0 inline-block px-2.5 py-[3px] rounded-full text-[11px] font-semibold tracking-wider uppercase ${STATUS_CLASS[task.status] || ''}`}>
            {task.status}
          </span>
        )}
      </div>
      
      {task.description && (
        <p className="text-[14px] text-text-muted leading-relaxed line-clamp-3 mb-4">
          {task.description}
        </p>
      )}

      {/* Meta row */}
      <div className="flex items-center justify-between flex-wrap gap-2 mt-auto pt-4 border-t border-border/50">
        <span className="text-[12px] font-medium text-text-faint flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          {task.dueDate ? task.dueDate : 'No due date'}
        </span>
        {task.createdBy?.name && (
          <span className="text-[12px] font-medium text-text-faint flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            {task.createdBy.name}
          </span>
        )}
      </div>

      {showClaimButton && (
        <button onClick={handleClaim}
          className="w-full py-2.5 rounded-lg border-none text-[13px] font-semibold text-white cursor-pointer btn-gradient font-sans mt-4 hover:shadow-lg transition-shadow">
          Claim Task →
        </button>
      )}
    </div>
  );
};

export default TaskCard;
