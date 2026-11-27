import React, { useRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useFocusTrap from '../useFocusTrap';
import useScrollLock from '../useScrollLock';
import Portal from '../../components/ui/Portal/Portal';

const Dialog = ({ onClose, withEscape }) => {
  const ref = useRef(null);
  useFocusTrap(ref, true, withEscape ? { onEscape: onClose } : undefined);
  return (
    <div ref={ref} role="dialog" aria-label="Test dialog">
      <button type="button">First</button>
      <a href="#middle">Middle</a>
      <button type="button" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

const Harness = ({ withEscape = false }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button">Before</button>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      {open && <Dialog withEscape={withEscape} onClose={() => setOpen(false)} />}
      <button type="button">After</button>
    </>
  );
};

describe('useFocusTrap', () => {
  test('moves focus in, cycles Tab and Shift+Tab, and restores focus to the opener', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const opener = screen.getByRole('button', { name: 'Open' });
    await user.click(opener);

    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Middle' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    await user.tab(); // wraps
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
    await user.tab({ shift: true }); // wraps back
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(opener).toHaveFocus();
  });

  test('calls onEscape and still restores focus', async () => {
    const user = userEvent.setup();
    render(<Harness withEscape />);
    const opener = screen.getByRole('button', { name: 'Open' });
    await user.click(opener);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(opener).toHaveFocus();
  });
});

describe('Portal + useFocusTrap', () => {
  const PortalDialog = ({ onClose }) => {
    const ref = useRef(null);
    useFocusTrap(ref, true, { onEscape: onClose });
    return (
      <Portal tone="dark">
        <div ref={ref} role="dialog" aria-label="Portal dialog">
          <button type="button">Inside</button>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </Portal>
    );
  };
  const Host = () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button type="button" onClick={() => setOpen(true)}>
          Open portal
        </button>
        {open && <PortalDialog onClose={() => setOpen(false)} />}
      </>
    );
  };

  test('the dialog is in body > .ia[data-tone], takes focus, and gives it back', async () => {
    const user = userEvent.setup();
    render(<Host />);
    const opener = screen.getByRole('button', { name: 'Open portal' });
    await user.click(opener);
    const dialog = screen.getByRole('dialog', { name: 'Portal dialog' });
    expect(dialog.parentElement).toHaveClass('ia');
    expect(dialog.parentElement).toHaveAttribute('data-tone', 'dark');
    expect(dialog.parentElement.parentElement).toBe(document.body);
    expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.querySelector('[data-ia-portal]')).toBeNull();
    expect(opener).toHaveFocus();
  });
});

describe('useScrollLock', () => {
  const Lock = ({ on }) => {
    useScrollLock(on);
    return null;
  };

  test('fixes the body at the offset and puts everything back on release', () => {
    const scrollTo = jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 420 });
    document.body.style.overflow = 'auto';

    const { rerender } = render(<Lock on />);
    expect(document.body.style.position).toBe('fixed');
    expect(document.body.style.top).toBe('-420px');
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<Lock on={false} />);
    expect(document.body.style.position).toBe('');
    expect(document.body.style.top).toBe('');
    expect(document.body.style.overflow).toBe('auto');
    expect(scrollTo).toHaveBeenCalledWith({ top: 420, left: 0, behavior: 'instant' });
    scrollTo.mockRestore();
  });

  test('two overlays lock once and release once, when the last closes', () => {
    const scrollTo = jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const { rerender } = render(
      <>
        <Lock on />
        <Lock on />
      </>
    );
    rerender(
      <>
        <Lock on />
        <Lock on={false} />
      </>
    );
    expect(document.body.style.position).toBe('fixed');
    rerender(
      <>
        <Lock on={false} />
        <Lock on={false} />
      </>
    );
    expect(document.body.style.position).toBe('');
    expect(scrollTo).toHaveBeenCalledTimes(1);
    scrollTo.mockRestore();
  });

  test('does not replay the offset onto a different route', () => {
    const scrollTo = jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
    window.history.replaceState(null, '', '/about');
    const { rerender } = render(<Lock on />);
    window.history.replaceState(null, '', '/contact');
    rerender(<Lock on={false} />);
    expect(document.body.style.position).toBe('');
    expect(scrollTo).not.toHaveBeenCalled();
    window.history.replaceState(null, '', '/');
    scrollTo.mockRestore();
  });
});
