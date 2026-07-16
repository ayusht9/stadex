import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Chatbot } from './Chatbot';
import React from 'react';

// Mock Worker
class WorkerMock {
  url: string;
  onmessage: ((ev: MessageEvent) => any) | null = null;
  
  constructor(stringUrl: string | URL) {
    this.url = stringUrl.toString();
  }

  postMessage(msg: any) {
    // Mock the response based on the message type
    if (msg.type === 'qa_load') {
      if (this.onmessage) {
        this.onmessage({ data: { type: 'qa', status: 'ready' } } as MessageEvent);
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
  global.Worker = WorkerMock as any;
});

describe('Chatbot Component', () => {
  it('renders chatbot UI and handles initialization', () => {
    render(<Chatbot />);
    
    // Check title
    expect(screen.getByText('Fan Chat & Q&A')).toBeInTheDocument();
    
    // Check initial bot message
    expect(screen.getByText(/Hello! I am your AI Stadium Assistant/)).toBeInTheDocument();
    
    // Check input is rendered (will be disabled until 'ready', but our mock sets it to ready)
    const input = screen.getByPlaceholderText('Ask about stadiums...');
    expect(input).toBeInTheDocument();
  });
});
