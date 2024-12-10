import { describe, it, expect } from "vitest";
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DevlogHome from '../components/DevlogHome';

describe('DevlogHome', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <DevlogHome />
      </BrowserRouter>
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('displays featured blogs section', () => {
    render(
      <BrowserRouter>
        <DevlogHome />
      </BrowserRouter>
    );
    expect(screen.getByText('Featured Blogs')).toBeInTheDocument();
  });

  it("renders blog cards", () => {
    render(
      <BrowserRouter>
        <DevlogHome />
      </BrowserRouter>
    );
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });
});
