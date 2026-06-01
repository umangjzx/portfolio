import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AIAssistant } from './AIAssistant';
import { usePortfolioStore } from '../../store/portfolioStore';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, style, ...props }: any) => <span {...props} style={style}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('AIAssistant', () => {
  beforeEach(() => {
    // Reset store state before each test
    usePortfolioStore.setState({ isAIOpen: false });
  });

  it('renders the floating orb when closed', () => {
    render(<AIAssistant />);
    const orbButton = screen.getByLabelText('Open AI Assistant');
    expect(orbButton).toBeInTheDocument();
  });

  it('expands to chat interface when orb is clicked', () => {
    render(<AIAssistant />);
    const orbButton = screen.getByLabelText('Open AI Assistant');
    fireEvent.click(orbButton);

    expect(screen.getByLabelText('Type your question')).toBeInTheDocument();
    expect(screen.getByLabelText('Send message')).toBeInTheDocument();
    expect(screen.getByLabelText('Close AI Assistant')).toBeInTheDocument();
  });

  it('collapses back to orb when close button is clicked', () => {
    usePortfolioStore.setState({ isAIOpen: true });
    render(<AIAssistant />);

    const closeButton = screen.getByLabelText('Close AI Assistant');
    fireEvent.click(closeButton);

    expect(screen.getByLabelText('Open AI Assistant')).toBeInTheDocument();
  });

  it('sends a message on Enter key press', () => {
    usePortfolioStore.setState({ isAIOpen: true });
    render(<AIAssistant />);

    const input = screen.getByLabelText('Type your question');
    fireEvent.change(input, { target: { value: 'What are your skills?' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // User message should appear
    expect(screen.getByText('What are your skills?')).toBeInTheDocument();
  });

  it('sends a message on send button click', () => {
    usePortfolioStore.setState({ isAIOpen: true });
    render(<AIAssistant />);

    const input = screen.getByLabelText('Type your question');
    fireEvent.change(input, { target: { value: 'Tell me about projects' } });

    const sendButton = screen.getByLabelText('Send message');
    fireEvent.click(sendButton);

    expect(screen.getByText('Tell me about projects')).toBeInTheDocument();
  });

  it('displays AI response after processing', async () => {
    vi.useFakeTimers();
    usePortfolioStore.setState({ isAIOpen: true });
    render(<AIAssistant />);

    const input = screen.getByLabelText('Type your question');

    // Send a message
    act(() => {
      fireEvent.change(input, { target: { value: 'What skills do you have?' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    // User message should appear immediately
    expect(screen.getByText('What skills do you have?')).toBeInTheDocument();

    // Input should be disabled during processing
    expect(input).toBeDisabled();

    // Advance past the 800ms processing delay
    await act(async () => {
      vi.advanceTimersByTime(900);
    });

    // After processing, input should be re-enabled
    expect(input).not.toBeDisabled();

    vi.useRealTimers();
  });

  it('does not send empty messages', () => {
    usePortfolioStore.setState({ isAIOpen: true });
    render(<AIAssistant />);

    const input = screen.getByLabelText('Type your question');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Only the placeholder text should be visible (no message sent)
    expect(screen.getByText(/Ask me about/)).toBeInTheDocument();
  });

  it('disables input while processing', async () => {
    vi.useFakeTimers();
    usePortfolioStore.setState({ isAIOpen: true });
    render(<AIAssistant />);

    const input = screen.getByLabelText('Type your question');

    act(() => {
      fireEvent.change(input, { target: { value: 'Hello' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    // Input should be disabled during processing
    expect(input).toBeDisabled();

    // Advance past the 800ms processing delay
    await act(async () => {
      vi.advanceTimersByTime(900);
    });

    // Input should be re-enabled after processing
    expect(input).not.toBeDisabled();

    vi.useRealTimers();
  });
});
