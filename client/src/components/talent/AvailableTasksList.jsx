import TaskCard from './TaskCard';

const AvailableTasksList = ({ tasks, onClaimed }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-bg-card border border-dashed border-border rounded-2xl py-16 px-6 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-border/30 flex items-center justify-center mb-4 text-text-muted">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 15h8"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
        </div>
        <h3 className="text-lg font-bold text-text-primary mb-1 font-display">No tasks available</h3>
        <p className="text-sm text-text-faint">There are no open tasks right now. Check back later!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} showClaimButton onClaimed={onClaimed} />
      ))}
    </div>
  );
};

export default AvailableTasksList;
