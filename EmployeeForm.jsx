import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineX, HiOutlineExclamationCircle } from 'react-icons/hi';
import { createEmployee, updateEmployee } from '../services/api';

const DEPARTMENTS = [
  'Engineering', 'Marketing', 'Sales', 'Human Resources',
  'Finance', 'Operations', 'Design', 'Product', 'Support', 'Legal',
];

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
  role: '',
  salary: '',
  dateOfJoining: new Date().toISOString().split('T')[0],
  status: 'Active',
};

function validate(form) {
  const errors = {};

  if (!form.firstName.trim()) errors.firstName = 'First name is required';
  else if (form.firstName.trim().length < 2) errors.firstName = 'At least 2 characters';

  if (!form.lastName.trim()) errors.lastName = 'Last name is required';
  else if (form.lastName.trim().length < 2) errors.lastName = 'At least 2 characters';

  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Invalid email format';

  if (!form.phone.trim()) errors.phone = 'Phone number is required';
  else if (!/^[\d\s\-\+\(\)]{7,20}$/.test(form.phone)) errors.phone = 'Invalid phone number';

  if (!form.department) errors.department = 'Department is required';

  if (!form.role.trim()) errors.role = 'Role is required';

  if (!form.salary && form.salary !== 0) errors.salary = 'Salary is required';
  else if (isNaN(form.salary) || Number(form.salary) < 0) errors.salary = 'Must be a positive number';

  if (!form.dateOfJoining) errors.dateOfJoining = 'Date of joining is required';

  return errors;
}

export default function EmployeeForm({ employee, onClose, onSuccess }) {
  const isEditing = !!employee;
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (employee) {
      setForm({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department: employee.department || '',
        role: employee.role || '',
        salary: employee.salary?.toString() || '',
        dateOfJoining: employee.dateOfJoining
          ? new Date(employee.dateOfJoining).toISOString().split('T')[0]
          : '',
        status: employee.status || 'Active',
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate single field
    const fieldErrors = validate(form);
    if (fieldErrors[name]) {
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched(
      Object.keys(INITIAL_FORM).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...form,
        salary: Number(form.salary),
      };

      if (isEditing) {
        await updateEmployee(employee._id, payload);
        toast.success('Employee updated successfully!');
      } else {
        await createEmployee(payload);
        toast.success('Employee added successfully!');
      }

      onSuccess();
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        const fieldErrors = {};
        serverErrors.forEach((e) => {
          fieldErrors[e.field] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        toast.error(err.response?.data?.message || 'Something went wrong');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const showError = (field) => touched[field] && errors[field];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <HiOutlineX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              {/* First Name */}
              <div className="form-group">
                <label className="form-label">
                  First Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  className={`form-input ${showError('firstName') ? 'error' : ''}`}
                  placeholder="John"
                  value={form.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  id="input-firstName"
                />
                {showError('firstName') && (
                  <span className="form-error">
                    <HiOutlineExclamationCircle /> {errors.firstName}
                  </span>
                )}
              </div>

              {/* Last Name */}
              <div className="form-group">
                <label className="form-label">
                  Last Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  className={`form-input ${showError('lastName') ? 'error' : ''}`}
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  id="input-lastName"
                />
                {showError('lastName') && (
                  <span className="form-error">
                    <HiOutlineExclamationCircle /> {errors.lastName}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className={`form-input ${showError('email') ? 'error' : ''}`}
                  placeholder="john.doe@company.com"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  id="input-email"
                />
                {showError('email') && (
                  <span className="form-error">
                    <HiOutlineExclamationCircle /> {errors.email}
                  </span>
                )}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label">
                  Phone <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  className={`form-input ${showError('phone') ? 'error' : ''}`}
                  placeholder="+1 (555) 123-4567"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  id="input-phone"
                />
                {showError('phone') && (
                  <span className="form-error">
                    <HiOutlineExclamationCircle /> {errors.phone}
                  </span>
                )}
              </div>

              {/* Department */}
              <div className="form-group">
                <label className="form-label">
                  Department <span className="required">*</span>
                </label>
                <select
                  name="department"
                  className={`form-select ${showError('department') ? 'error' : ''}`}
                  value={form.department}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  id="input-department"
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {showError('department') && (
                  <span className="form-error">
                    <HiOutlineExclamationCircle /> {errors.department}
                  </span>
                )}
              </div>

              {/* Role */}
              <div className="form-group">
                <label className="form-label">
                  Role <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="role"
                  className={`form-input ${showError('role') ? 'error' : ''}`}
                  placeholder="Software Engineer"
                  value={form.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  id="input-role"
                />
                {showError('role') && (
                  <span className="form-error">
                    <HiOutlineExclamationCircle /> {errors.role}
                  </span>
                )}
              </div>

              {/* Salary */}
              <div className="form-group">
                <label className="form-label">
                  Salary (USD) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="salary"
                  className={`form-input ${showError('salary') ? 'error' : ''}`}
                  placeholder="85000"
                  value={form.salary}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="0"
                  step="1000"
                  id="input-salary"
                />
                {showError('salary') && (
                  <span className="form-error">
                    <HiOutlineExclamationCircle /> {errors.salary}
                  </span>
                )}
              </div>

              {/* Date of Joining */}
              <div className="form-group">
                <label className="form-label">
                  Date of Joining <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfJoining"
                  className={`form-input ${showError('dateOfJoining') ? 'error' : ''}`}
                  value={form.dateOfJoining}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  id="input-dateOfJoining"
                />
                {showError('dateOfJoining') && (
                  <span className="form-error">
                    <HiOutlineExclamationCircle /> {errors.dateOfJoining}
                  </span>
                )}
              </div>

              {/* Status */}
              <div className="form-group full-width">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  className="form-select"
                  value={form.status}
                  onChange={handleChange}
                  id="input-status"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting} id="submit-employee-btn">
              {submitting
                ? (isEditing ? 'Updating...' : 'Adding...')
                : (isEditing ? 'Update Employee' : 'Add Employee')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
