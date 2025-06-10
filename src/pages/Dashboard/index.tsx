import { Button } from 'metis-ui';
import { useNavigate } from 'react-router';

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div>
      Dashboard
      <Button type="primary" onClick={() => navigate('/system/account')}>
        Back
      </Button>
    </div>
  );
};

export default Dashboard;
