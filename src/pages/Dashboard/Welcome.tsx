import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';

const Dashboard: React.FC = () => {
  return (
    <DefaultLayout>
      <div className='flex justify-center'>
        <h1>Welcome to the Commenter AI Dashboard</h1>
      </div>
    </DefaultLayout>
  );
};

export default Dashboard;
