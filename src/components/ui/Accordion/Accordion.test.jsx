import React, { useState } from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Accordion, { AccordionItem } from './Accordion';

const items = [
  { id: 'q1', title: 'First question', body: 'First answer' },
  { id: 'q2', title: 'Second question', body: 'Second answer' },
  { id: 'q3', title: 'Third question', body: 'Third answer' },
];

const renderAccordion = (props = {}) =>
  render(
    <Accordion openOnHash={false} {...props}>
      {items.map((item, i) => (
        <AccordionItem key={item.id} id={item.id} index={i + 1} title={item.title}>
          <p>{item.body}</p>
        </AccordionItem>
      ))}
    </Accordion>
  );

const header = (name) => screen.getByRole('button', { name: new RegExp(name) });

describe('Accordion', () => {
  test('headers are buttons inside headings with aria-expanded and aria-controls', () => {
    renderAccordion({ defaultOpenId: 'q1' });
    const first = header('First question');
    expect(first.closest('h3')).not.toBeNull();
    expect(first).toHaveAttribute('aria-expanded', 'true');
    const panel = document.getElementById(first.getAttribute('aria-controls'));
    expect(panel).toHaveAttribute('role', 'region');
    expect(screen.getByRole('region', { name: /First question/ })).toBe(panel);
    expect(header('Second question')).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById('q2-panel')).not.toBeVisible();
  });

  test('Enter and Space toggle an item', async () => {
    const user = userEvent.setup();
    renderAccordion();
    const second = header('Second question');
    second.focus();
    await user.keyboard('{Enter}');
    expect(second).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Second answer')).toBeVisible();
    await user.keyboard(' ');
    expect(second).toHaveAttribute('aria-expanded', 'false');
  });

  test('single-open: opening one closes the other', async () => {
    const user = userEvent.setup();
    renderAccordion({ defaultOpenId: 'q1' });
    await user.click(header('Third question'));
    expect(header('Third question')).toHaveAttribute('aria-expanded', 'true');
    expect(header('First question')).toHaveAttribute('aria-expanded', 'false');
  });

  test('multiple: items stay open together', async () => {
    const user = userEvent.setup();
    renderAccordion({ multiple: true });
    await user.click(header('First question'));
    await user.click(header('Second question'));
    expect(header('First question')).toHaveAttribute('aria-expanded', 'true');
    expect(header('Second question')).toHaveAttribute('aria-expanded', 'true');
  });

  test('controlled: openId + onToggle', async () => {
    const user = userEvent.setup();
    const seen = [];
    const Controlled = () => {
      const [open, setOpen] = useState('q2');
      return (
        <Accordion
          openOnHash={false}
          openId={open}
          onToggle={(id, isOpen, next) => {
            seen.push([id, isOpen, next]);
            setOpen(next);
          }}
        >
          {items.map((item) => (
            <AccordionItem key={item.id} id={item.id} title={item.title}>
              {item.body}
            </AccordionItem>
          ))}
        </Accordion>
      );
    };
    render(<Controlled />);
    expect(header('Second question')).toHaveAttribute('aria-expanded', 'true');
    await user.click(header('First question'));
    expect(seen).toEqual([['q1', true, 'q1']]);
    expect(header('First question')).toHaveAttribute('aria-expanded', 'true');
    expect(header('Second question')).toHaveAttribute('aria-expanded', 'false');
  });

  test('arrow keys move between headers', async () => {
    const user = userEvent.setup();
    renderAccordion();
    header('First question').focus();
    await user.keyboard('{ArrowDown}');
    expect(header('Second question')).toHaveFocus();
    await user.keyboard('{End}');
    expect(header('Third question')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(header('First question')).toHaveFocus();
  });

  test('each item carries its id, and the hash opens it', () => {
    window.history.replaceState(null, '', '#q3');
    render(
      <Accordion>
        {items.map((item) => (
          <AccordionItem key={item.id} id={item.id} title={item.title}>
            {item.body}
          </AccordionItem>
        ))}
      </Accordion>
    );
    expect(document.getElementById('q3')).toHaveAttribute('data-accordion-item', 'q3');
    expect(header('Third question')).toHaveAttribute('aria-expanded', 'true');
    act(() => {
      window.history.replaceState(null, '', '#q1');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(header('First question')).toHaveAttribute('aria-expanded', 'true');
    window.history.replaceState(null, '', ' ');
  });
});
