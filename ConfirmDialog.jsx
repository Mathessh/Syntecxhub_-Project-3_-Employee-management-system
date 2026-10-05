import { HiOutlineExclamation } from 'react-icons/hi';

export default function ConfirmDialog({ employee, onCancel, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal"
        style={{ maxWidth: 440 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-body">
          <div className="confirm-dialog">
            <div className="confirm-icon">
              <HiOutlineExclamation />
            </div>
            <h3 className="confirm-title">Delete Employee</h3>
            <p className="confirm-message">
              Are you sure you want to remove{' '}
              <span className="confirm-name">
                {employee.firstName} {employee.lastName}
              </span>{' '}
              from the system? This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={onConfirm} id="confirm-delete-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
