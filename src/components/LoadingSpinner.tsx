
const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center w-full h-32">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-travel-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-travel-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
