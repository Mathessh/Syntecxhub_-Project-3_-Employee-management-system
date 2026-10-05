import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  HiOutlineSearch,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineUsers,
} from 'react-icons/hi';
import { getEmployees, deleteEmployee } from '../services/api';
import EmployeeForm from '../components/EmployeeForm';
import ConfirmDialog from '../components/ConfirmDialog';

const DEPARTMENTS = [
  'Engineering', 'Marketing', 'Sales', 'Human Resources',
  'Finance', 'Operations', 'Design', 'Product', 'Support', 'Legal',
];

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

function getStatusBadge(status) {
  const classes = {
    Active: 'badge-active',
    'On Leave': 'badge-leave',
    Terminated: 'badge-terminated',
  };
  return (
    <span className={`badge ${classes[status] || 'badge-active'}`}>
      <span className="badge-dot" />
      {status}
    </span>
  );
}

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 1 });
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');

  // Modal states
  const [formOpen, setFormOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchEmployees = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (department) params.department = department;
      if (status) params.status = status;

      const res = await getEmployees(params);
      setEmployees(res.data);
      setPagination(res.pagination);
    } catch (err) {
      toast.error('Failed to load employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, department, status]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchEmployees(1);
    }, 300);
    return () => clearTimeout(debounce);
  }, [fetchEmployees]);

  const handleCreate = () => {
    setEditEmployee(null);
    setFormOpen(true);
  };

  const handleEdit = (emp) => {
    setEditEmployee(emp);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditEmployee(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchEmployees(pagination.page);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEmployee(deleteTarget._id);
      toast.success(`${deleteTarget.firstName} ${deleteTarget.lastName} has been removed`);
      setDeleteTarget(null);
      fetchEmployees(pagination.page);
    } catch (err) {
      toast.error('Failed to delete employee');
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.pages) {
      fetchEmployees(page);
    }
  };

  const renderPaginationButtons = () => {
    const { page, pages } = pagination;
    const buttons = [];
    const range = 2;

    let start = Math.max(1, page - range);
    let end = Math.min(pages, page + range);

    if (start > 1) {
      buttons.push(
        <button key={1} className="page-btn" onClick={() => goToPage(1)}>1</button>
      );
      if (start > 2) {
        buttons.push(<span key="start-dots" style={{ padding: '0 4px', color: 'var(--text-muted)' }}>…</span>);
      }
    }

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          className={`page-btn ${i === page ? 'active' : ''}`}
          onClick={() => goToPage(i)}
        >
          {i}
        </button>
      );
    }

    if (end < pages) {
      if (end < pages - 1) {
        buttons.push(<span key="end-dots" style={{ padding: '0 4px', color: 'var(--text-muted)' }}>…</span>);
      }
      buttons.push(
        <button key={pages} className="page-btn" onClick={() => goToPage(pages)}>{pages}</button>
      );
    }

    return buttons;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">
            Manage your team members
            {pagination.total > 0 && ` · ${pagination.total} total`}
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate} id="add-employee-btn">
          <HiOutlinePlus /> Add Employee
        </button>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <HiOutlineSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="search-input"
          />
        </div>
        <select
          className="filter-select"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          id="department-filter"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          id="status-filter"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Terminated">Terminated</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="table-container">
          <div className="loader-container">
            <div className="loader" />
          </div>
        </div>
      ) : employees.length === 0 ? (
        <div className="table-container">
          <div className="empty-state">
            <div className="empty-icon">
              <HiOutlineUsers />
            </div>
            <h3 className="empty-title">No employees found</h3>
            <p className="empty-message">
              {search || department || status
                ? 'Try adjusting your search filters to find what you\'re looking for.'
                : 'Get started by adding your first employee to the system.'}
            </p>
            {!search && !department && !status && (
              <button className="btn btn-primary" onClick={handleCreate}>
                <HiOutlinePlus /> Add First Employee
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Role</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td>
                    <div className="employee-cell">
                      <div className={`employee-avatar ${getAvatarColor(emp.firstName)}`}>
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      <div>
                        <div className="employee-name">{emp.firstName} {emp.lastName}</div>
                        <div className="employee-email">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="dept-badge">{emp.department}</span></td>
                  <td>{emp.role}</td>
                  <td><span className="salary">{formatCurrency(emp.salary)}</span></td>
                  <td>{getStatusBadge(emp.status)}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                    {formatDate(emp.dateOfJoining)}
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="action-btn edit"
                        title="Edit employee"
                        onClick={() => handleEdit(emp)}
                      >
                        <HiOutlinePencil />
                      </button>
                      <button
                        className="action-btn delete"
                        title="Delete employee"
                        onClick={() => setDeleteTarget(emp)}
                      >
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <div className="pagination-info">
                Showing {(pagination.page - 1) * pagination.limit + 1}–
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} employees
              </div>
              <div className="pagination-controls">
                <button
                  className="page-btn"
                  disabled={pagination.page === 1}
                  onClick={() => goToPage(pagination.page - 1)}
                >
                  <HiOutlineChevronLeft />
                </button>
                {renderPaginationButtons()}
                <button
                  className="page-btn"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => goToPage(pagination.page + 1)}
                >
                  <HiOutlineChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      {formOpen && (
        <EmployeeForm
          employee={editEmployee}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          employee={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
