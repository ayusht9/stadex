import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Translator } from './Translator';
import { AuthProvider } from '../context/AuthContext';

// Mock Worker
class WorkerMock {
  url: string;
  onmessage: ((ev: MessageEvent) => any) | null = null;
  
  constructor(stringUrl: string | URL) {
    this.url = stringUrl.toString();
  }

  postMessage(msg: any) {
    if (msg.type === 'translate_load') {
      if (this.onmessage) {
        this.onmessage({ data: { type: 'translate', status: 'ready' } } as MessageEvent);
      }
    }
  }

  addEventListener(type: string, listener: EventListenerOrEventListenerObject) {
    if (type === 'message') {
      this.onmessage = listener as ((ev: MessageEvent) => any);
    }
  }

  terminate() {}
}

beforeEach(() => {
  vi.stubGlobal('Worker', WorkerMock);
});

describe('Translator Component', () => {
  it('shows restricted access if not logged in as Staff', () => {
    render(
      <AuthProvider>
        <Translator />
      </AuthProvider>
    );
    
    expect(screen.getByText('Staff Access Required')).toBeInTheDocument();
  });
});
