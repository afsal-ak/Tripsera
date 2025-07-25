import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground px-4 text-center">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="px-6 py-2 bg-primary text-white rounded-full shadow-md hover:bg-primary/90 transition duration-300"
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFoundPage;
