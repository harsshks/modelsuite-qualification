import { useState } from 'react';
import SubmitTaskModal from './SubmitTaskModal';

/* ── Status badge classes ── */
const STATUS_CLASS = {
  Open:      'status-badge-Open',
  Claimed:   'status-badge-Claimed',
  Submitted: 'status-badge-Submitted',
  Approved:  'status-badge-Approved',
  Rejected:  'status-badge-Rejected',
};

/* ── Calendar icon ── */
const IconCalendar = () => (
  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="14" height="14" rx="2"/>
    <path d="M7 2v4M13 2v4M3 9h14"/>
  </svg>
);

/* ── Upload icon ── */
const IconUpload = () => (
  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 14V4M6 8l4-4 4 4"/>
    <path d="M3 17h14"/>
  </svg>
);

const fmtDate = (raw) => {
  if (!raw) return null;
  try {
    const d = new Date(raw);
    if (isNaN(d)) return raw;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return raw; }
};

const MyTasksList = ({ tasks, onRefresh }) => {
  const [submitTarget, setSubmitTarget] = useState(null);

  if (!tasks || tasks.length === 0) {
    return (
      <div className="py-12 px-6 text-center rounded-xl bg-white/[0.015] border border-dashed border-white/10">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
          className="mx-auto mb-2.5 text-text-faint opacity-40" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
        <p className="text-[13px] text-text-faint font-body">You haven&apos;t claimed any tasks yet. Go grab one above!</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {tasks.map((task, i) => {
          /* Timeline steps mapped to real statuses */
          const steps = ['Claimed', 'Submitted', 'Approved'];
          const isRejected = task.status === 'Rejected';
          const currentIdx = steps.indexOf(task.status);

          return (
          <div key={task._id}
            className="task-card table-row-animate"
            style={{ animationDelay: `${i * 0.06}s` }}>

            {/* Task info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate mb-1 text-[13.5px] text-text-primary font-body">
                {task.title || 'Untitled Task'}
              </p>

              {/* Status Timeline */}
              <div className="flex items-center gap-1 mb-1">
                {steps.map((step, si) => {
                  const reached = isRejected ? si === 0 : si <= currentIdx;
                  return (
                    <div key={step} className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full transition-colors ${
                        isRejected && si === steps.length - 1 ? 'bg-red-500' :
                        reached ? 'bg-emerald-400' : 'bg-border'
                      }`} />
                      <span className={`text-[10px] ${reached ? 'text-text-muted' : 'text-text-faint'}`}>
                        {isRejected && si === steps.length - 1 ? 'Rejected' : step}
                      </span>
                      {si < steps.length - 1 && (
                        <div className={`w-4 h-px ${si < currentIdx && !isRejected ? 'bg-emerald-400/50' : 'bg-border'}`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {fmtDate(task.dueDate) && (
                <p className="flex items-center gap-1.5 text-[11.5px] text-text-faint">
                  <IconCalendar />
                  Due {fmtDate(task.dueDate)}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {(task.status === 'Claimed' || task.status === 'Submitted') && (
                <button
                  onClick={() => setSubmitTarget(task)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer border transition-all bg-primary/[0.08] text-blue-400 border-primary/25 hover:bg-primary/[0.16] hover:border-primary/40 font-body">
                  <IconUpload />
                  {task.status === 'Submitted' ? 'Re-submit' : 'Submit'}
                </button>
              )}

              {task.status ? (
                <span
                  className={`inline-block px-2.5 py-[3px] rounded-full text-[11px] font-medium font-body ${STATUS_CLASS[task.status] || ''}`}>
                  {task.status}
                </span>
              ) : (
                <span
                  className="inline-block px-2.5 py-[3px] rounded-full text-[11px] font-medium font-body status-badge-Open">
                  —
                </span>
              )}
            </div>
          </div>
          );
        })}
      </div>

      {submitTarget && (
        <SubmitTaskModal
          task={submitTarget}
          onClose={() => setSubmitTarget(null)}
          onSubmitted={() => { setSubmitTarget(null); if (onRefresh) onRefresh(); }}
        />
      )}
    </>
  );
};

export default MyTasksList;
