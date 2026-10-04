'use client';

export const PopupDeleteButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    style={{ marginTop: 8, color: '#e11d48', cursor: 'pointer', fontSize: 13 }}
  >
    Delete
  </button>
);
