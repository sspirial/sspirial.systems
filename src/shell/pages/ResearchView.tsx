import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ResearchView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      navigate(`/research/${id}`, { replace: true });
    } else {
      navigate('/research', { replace: true });
    }
  }, [id, navigate]);

  return (
    <div className="flex items-center justify-center min-h-[50vh] font-mono text-xs text-gray-500 uppercase tracking-widest">
      Redirecting to research terminal...
    </div>
  );
};

export default ResearchView;
