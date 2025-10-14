import './StatusChip.css';

const StatusChip = ({ status, message, className = '' }) => {
  return (
    <div className={`status-chip status-chip--${status} ${className}`}>
      {message}
    </div>
  );
};

export default StatusChip;