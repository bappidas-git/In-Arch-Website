import React from 'react';
import { render, screen } from '@testing-library/react';
import FactList, { presentFacts } from './FactList';

describe('FactList', () => {
  test('renders a <dl> and omits every pair whose value is empty', () => {
    const { container } = render(
      <FactList
        items={[
          { label: 'Category', value: 'Interior Design' },
          { label: 'Location', value: '' },
          { label: 'Area', value: '   ' },
          { label: 'Year', value: null },
          { label: 'Client', value: undefined },
          { label: 'Tags', value: [] },
          { label: 'Address', value: ['Boring Road', '', 'Patna, Bihar'] },
        ]}
      />
    );
    expect(container.querySelector('dl')).not.toBeNull();
    const terms = Array.from(container.querySelectorAll('dt')).map((dt) => dt.textContent);
    expect(terms).toEqual(['Category', 'Address']);
    expect(screen.getByText('Boring Road')).toBeInTheDocument();
    expect(screen.getByText('Patna, Bihar')).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/N\/A|—/);
  });

  test('renders nothing when every value is empty', () => {
    const { container } = render(<FactList items={[{ label: 'Location', value: '' }]} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('presentFacts keeps zero and nodes', () => {
    expect(presentFacts([{ label: 'Count', value: 0 }, { label: 'Node', value: <b>x</b> }])).toHaveLength(2);
  });
});
