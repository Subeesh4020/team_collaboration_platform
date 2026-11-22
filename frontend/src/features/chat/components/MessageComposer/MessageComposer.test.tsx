import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MessageComposer } from './MessageComposer';

describe('<MessageComposer>', () => {
  it('sends trimmed text on Enter and keeps Shift+Enter as a newline', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<MessageComposer channelId="c1" conversationName="#test" canPost onSend={onSend} />);
    const input = screen.getByRole('textbox', { name: 'Message #test' });

    await user.type(input, '  line one{Shift>}{Enter}{/Shift}line two  {Enter}');

    expect(onSend).toHaveBeenCalledWith('line one\nline two');
    expect(input).toHaveValue('');
  });

  it('disables sending empty messages', () => {
    render(<MessageComposer channelId="c2" conversationName="#test" canPost onSend={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
  });

  it('explains when the user cannot post', () => {
    render(
      <MessageComposer channelId="c3" conversationName="#test" canPost={false} onSend={vi.fn()} />,
    );
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByRole('note')).toHaveTextContent("don't have permission to post");
  });
});
