export default function LoadingSpinner({ fullScreen = false, size = 'md' }) {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const spinner = (
    <div
      className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-primary-200 border-t-primary-600`}
    />
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center py-8">{spinner}</div>;
}
