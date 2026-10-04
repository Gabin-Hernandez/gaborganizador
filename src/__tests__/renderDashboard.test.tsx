// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

import * as LucideIcons from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

describe('Icons & UI Primitives Audit', () => {
  it('should render all imported icons without throwing', () => {
    const iconNames = [
      'LayoutDashboard', 'Tags', 'TrendingUp', 'DollarSign', 'PieChart',
      'Layers', 'LogOut', 'Wallet', 'X', 'Menu', 'Plus', 'Sparkles',
      'CheckCircle2', 'Check', 'ChevronRight', 'ChevronLeft', 'Calendar',
      'TrendingDown', 'Clock', 'ArrowDownLeft', 'ArrowUpRight', 'ShieldCheck',
      'Tag', 'Archive', 'Mail', 'Lock', 'ArrowRight', 'Trash2', 'Save',
      'CheckCircle', 'BarChart3', 'Percent', 'AlertCircle', 'FolderOpen'
    ];

    iconNames.forEach((name) => {
      const IconComp = (LucideIcons as any)[name];
      if (!IconComp) {
        throw new Error(`ICON ${name} IS UNDEFINED IN LUCIDE-REACT!`);
      }
      expect(typeof IconComp === 'function' || typeof IconComp === 'object').toBe(true);
      expect(IconComp).toBeTruthy();
    });
  });

  it('should render UI primitives without throwing', () => {
    const { container: btn } = render(<Button>Test</Button>);
    expect(btn).toBeDefined();

    const { container: card } = render(<Card>Test Card</Card>);
    expect(card).toBeDefined();

    const { container: inp } = render(<Input label="Test" />);
    expect(inp).toBeDefined();

    const { container: empty } = render(<EmptyState title="Empty" description="desc" />);
    expect(empty).toBeDefined();

    const { container: load } = render(<LoadingSpinner />);
    expect(load).toBeDefined();
  });
});
