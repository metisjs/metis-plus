import { Button } from 'metis-ui';
import { useNavigate } from 'react-router';
import { router } from '@/routes';

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div>
      Dashboard
      <Button type="primary" onClick={() => router.navigate('/login', { replace: true })}>
        Back
      </Button>
    </div>
  );
};

export default Dashboard;
