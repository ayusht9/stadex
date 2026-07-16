import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import React from 'react';

const TestComponent = () => {
  const { user, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="user-role">{user ? user.role : 'Guest'}</div>
      <button onClick={() => login({ id: '1', name: 'Fan', email: 'f@f.com', role: 'Fan' })} data-testid="login-fan">Login Fan</button>
      <button onClick={() => login({ id: '2', name: 'Staff', email: 's@s.com', role: 'Staff' })} data-testid="login-staff">Login Staff</button>
      <button onClick={logout} data-testid="logout">Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  it('provides authentication state and functions', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Initial state
    expect(screen.getByTestId('user-role').textContent).toBe('Guest');
    
    // Login as Fan
    fireEvent.click(screen.getByTestId('login-fan'));
    expect(screen.getByTestId('user-role').textContent).toBe('Fan');
    
    // Login as Staff
    fireEvent.click(screen.getByTestId('login-staff'));
    expect(screen.getByTestId('user-role').textContent).toBe('Staff');
    
    // Logout
    fireEvent.click(screen.getByTestId('logout'));
    expect(screen.getByTestId('user-role').textContent).toBe('Guest');
  });
});
