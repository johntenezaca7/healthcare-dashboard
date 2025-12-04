import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '../dialog';

describe('Dialog', () => {
  it('renders dialog trigger', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByText('Open Dialog')).toBeInTheDocument();
  });

  it('opens dialog when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByText('Open');
    await user.click(trigger);

    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
  });

  it('renders dialog title', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open'));
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders dialog description', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Description text</DialogDescription>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open'));
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  it('renders dialog header', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open'));
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders dialog footer', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogFooter>Footer content</DialogFooter>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open'));
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('applies custom className to dialog content', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className="custom-dialog">
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open'));
    const content = screen.getByText('Title').closest('[role="dialog"]');
    expect(content).toHaveClass('custom-dialog');
  });
});

