import { useEffect, useState } from 'react';
import TalentSidebar from '../../components/talent/TalentSidebar';
import AvailableTasksList from '../../components/talent/AvailableTasksList';
import MyTasksList from '../../components/talent/MyTasksList';
import { fetchAvailableTasks, fetchMyTasks } from '../../api/talent';
import { useAuth } from '../../context/AuthContext';

/* ── Wave emoji stripped, use clean greeting ── */

const TalentDashboard = () => {
  const { user } = useAuth();
  const [availableTasks, setAvailableTasks] = useState([]);
  const [myTasks, setMyTasks]               = useState([]);
  const [error, setError] = useState(null);

  const loadAvailable = async () => {
    try { const { data } = await fetchAvailableTasks(); setAvailableTasks(data); }
    catch { setError('Failed to load available tasks'); }
  };

  const loadMyTasks = async () => {
    try { const { data } = await fetchMyTasks(); setMyTasks(data); }
    catch { setError('Failed to load your tasks'); }
  };

  // eslint-disable-next-line
  useEffect(() => { loadAvailable(); loadMyTasks(); }, []);
  const handleRefresh = () => { loadAvailable(); loadMyTasks(); };

  return (
    <div className="flex min-h-screen bg-bg-dark">
      <TalentSidebar />

      <main className="ml-[220px] flex-1 px-8 py-8" style={{ maxWidth: 'calc(100vw - 220px)' }}>

        {/* Hero: Greeting + Stats */}
        <div className="mb-7 page-section">
          <h1 className="text-[22px] font-semibold tracking-tight text-text-primary font-display">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="mt-0.5 text-[13px] text-text-muted mb-5">
            Browse available tasks below and claim one to get started.
          </p>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Tasks', value: myTasks.length, color: 'text-primary' },
              { label: 'In Progress', value: myTasks.filter(t => t.status === 'Claimed' || t.status === 'Submitted').length, color: 'text-yellow-400' },
              { label: 'Completed', value: myTasks.filter(t => t.status === 'Approved').length, color: 'text-emerald-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-bg-card border border-border rounded-xl px-5 py-4 hover-lift">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-faint mb-1 font-body">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-[13px] mb-4 px-4 py-3 rounded-lg text-red-400 bg-red-500/[0.08] border border-red-500/20">
            {error}
          </p>
        )}

        {/* Available Tasks */}
        <section className="mb-7 page-section">
          <div className="flex items-center gap-2.5 mb-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-faint font-body">
              Available Tasks
            </h2>
            <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-white/5 text-text-muted border border-white/[0.08]">
              {availableTasks.length}
            </span>
          </div>
          <AvailableTasksList tasks={availableTasks} onClaimed={handleRefresh} />
        </section>

        {/* My Tasks */}
        <section className="mb-7 page-section">
          <div className="flex items-center gap-2.5 mb-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-faint font-body">
              My Tasks
            </h2>
            <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-white/5 text-text-muted border border-white/[0.08]">
              {myTasks.length}
            </span>
          </div>
          <MyTasksList tasks={myTasks} onRefresh={handleRefresh} />
        </section>
      </main>
    </div>
  );
};

export default TalentDashboard;
