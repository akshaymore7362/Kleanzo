import React from 'react';
import HomePage, { metadata } from './(public)/page';
import PublicLayout from './(public)/layout';

export { metadata };

export default function RootPage() {
  return (
    <PublicLayout>
      <HomePage />
    </PublicLayout>
  );
}
