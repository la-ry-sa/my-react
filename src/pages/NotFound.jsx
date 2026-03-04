import React from 'react';
import { Link } from 'react-router';

function NotFound() {
  return (
    <div>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Go back to the home page</Link>
    </div>
  );
}

export default NotFound;
