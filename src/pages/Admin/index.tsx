import { Button } from 'metis-ui';
import { useNavigate } from 'react-router';

const Admin = () => {
  const navigate = useNavigate();
  return (
    <div>
      Admin
      <Button type="primary" onClick={() => navigate('/dashboard')}>
        Back
      </Button>
    </div>
  );
};

export default Admin;
