import React from 'react';
import { Providers } from '../Providers';
import SignIn from './SignIn';

const SignInPage: React.FC = () => {
    return (
        <Providers>
            <SignIn />
        </Providers>
    );
};

export default SignInPage;
