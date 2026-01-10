/**
 * Empty State Component Tests
 *
 * Tests for the reusable empty state component.
 */

// Mock the utils to avoid loading server-side code
jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...args) => args.filter(Boolean).join(' ')),
}));

import { render, screen } from '@testing-library/react';
import { EmptyState } from '@/components/empty-state';
import { FileText } from 'lucide-react';

describe('EmptyState', () => {
  it('should render title and description', () => {
    render(
      <EmptyState
        icon={FileText}
        title="No items found"
        description="There are no items to display"
      />
    );

    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('There are no items to display')).toBeInTheDocument();
  });

  it('should render icon', () => {
    const { container } = render(
      <EmptyState
        icon={FileText}
        title="No files"
        description="Upload your first file"
      />
    );

    // Check that an SVG is rendered (icon from lucide-react)
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should render primary action button when provided', () => {
    const handleClick = jest.fn();

    render(
      <EmptyState
        icon={FileText}
        title="No items"
        description="Get started"
        actionLabel="Create Item"
        onAction={handleClick}
      />
    );

    const button = screen.getByRole('button', { name: 'Create Item' });
    expect(button).toBeInTheDocument();

    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should render secondary action button when provided', () => {
    const handlePrimary = jest.fn();
    const handleSecondary = jest.fn();

    render(
      <EmptyState
        icon={FileText}
        title="No items"
        description="Get started"
        actionLabel="Create Item"
        onAction={handlePrimary}
        secondaryActionLabel="Learn More"
        onSecondaryAction={handleSecondary}
      />
    );

    const primaryButton = screen.getByRole('button', { name: 'Create Item' });
    const secondaryButton = screen.getByRole('button', { name: 'Learn More' });

    expect(primaryButton).toBeInTheDocument();
    expect(secondaryButton).toBeInTheDocument();

    secondaryButton.click();
    expect(handleSecondary).toHaveBeenCalledTimes(1);
  });

  it('should not render action buttons when not provided', () => {
    render(
      <EmptyState
        icon={FileText}
        title="No items"
        description="Nothing here"
      />
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
