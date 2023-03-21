import { Link } from 'react-router-dom';

const Error404 = () => {
  return (
    <div style={{ display: 'grid', placeItems: 'center', textAlign: 'center' }}>
      <h3> Page Not Found</h3>
      <Link to={'/'}>
        <h3>Go Back To Home Page</h3>
      </Link>
    </div>
  );
};

export default Error404;
