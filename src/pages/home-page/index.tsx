import type { JSX } from 'react';

import RegistrationForm from '@/components/forms/registration/registration-form';

const HomePage = (): JSX.Element => {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the Home Page!</p>
      <RegistrationForm />
    </div>
  );
};

export default HomePage;
