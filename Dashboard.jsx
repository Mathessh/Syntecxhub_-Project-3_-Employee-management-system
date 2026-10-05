import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineUsers,
  HiOutlineBadgeCheck,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineArrowRight,
} from 'react-icons/hi';
import { getStats } from '../services/api';

const AVATAR_COLORS = [
  'avatar-1', 'avatar-2', 'avatar-3', 'avatar-4',
  'avatar-5', 'avatar-6', 'avatar-7', 'avatar-8',
];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Overview of your workforce</p>
          </div>
        </div>
        <div className="stats-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 100 }} />
          ))}
        </div>
        <div className="skeleton" style={{ height: 300, marginBottom: 20 }} />
      </div>
    );
  }

  if (!stats) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Overview of your workforce</p>
          </div>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3 className="empty-title">No Data Available</h3>
          <p className="empty-message">
            Add some employees to see your dashboard statistics come to life.
          </p>
          <Link to="/employees" className="btn btn-primary">
            <HiOutlineUsers /> Go to Employees
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your workforce</p>
        </div>
        <Link to="/employees" className="btn btn-primary">
          <HiOutlineUsers /> View All Employees
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">
            <HiOutlineUsers />
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Employees</div>
            <div className="stat-value">{stats.totalEmployees}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <HiOutlineBadgeCheck />
          </div>
          <div className="stat-info">
            <div className="stat-label">Active</div>
            <div className="stat-value">{stats.activeEmployees}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <HiOutlineClock />
          </div>
          <div className="stat-info">
            <div className="stat-label">On Leave</div>
            <div className="stat-value">{stats.onLeave}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <HiOutlineCurrencyDollar />
          </div>
          <div className="stat-info">
            <div className="stat-label">Avg. Salary</div>
            <div className="stat-value">{formatCurrency(stats.avgSalary)}</div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Department Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
            Department Breakdown
          </h3>
          {stats.departmentStats.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              No department data yet.
            </p>
          ) : (
            <div className="dept-chart">
              {stats.departmentStats.map((dept) => (
                <div className="dept-item" key={dept._id}>
                  <div className="dept-bar" />
                  <div>
                    <div className="dept-name">{dept._id}</div>
                    <div className="dept-count">{dept.count}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Hires */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recent Hires</h3>
            <Link to="/employees" className="btn btn-ghost btn-sm">
              View All <HiOutlineArrowRight />
            </Link>
          </div>
          {stats.recentHires.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              No employees added yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stats.recentHires.map((emp) => (
                <div
                  key={emp._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    background: 'var(--bg-input)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div className={`employee-avatar ${getAvatarColor(emp.firstName)}`}>
                    {emp.firstName[0]}{emp.lastName[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      {emp.firstName} {emp.lastName}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {emp.role} · {emp.department}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {formatDate(emp.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Total Payroll Banner */}
      {stats.totalPayroll > 0 && (
        <div
          className="card"
          style={{
            marginTop: 20,
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.08))',
            borderColor: 'rgba(139, 92, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Monthly Payroll
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px', marginTop: 4 }}>
              {formatCurrency(stats.totalPayroll)}
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Across <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{stats.totalEmployees}</span> employees
          </div>
        </div>
      )}
    </div>
  );
}
