import { Skeleton } from 'metis-ui';

const Loading = () => {
  return (
    <div className="w-full p-10">
      <Skeleton loading active title />
    </div>
  );
};

export default Loading;
