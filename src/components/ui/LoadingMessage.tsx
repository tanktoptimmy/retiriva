interface LoadingMessageProps {
  message?: string;
}

export default function LoadingMessage({ message = "Loading..." }: LoadingMessageProps) {
  return (
    <div className="p-4 rounded-xl shadow transition-colors bg-blue-50 dark:bg-blue-900">
      <p className="text-blue-800 dark:text-blue-200">
        {message}
      </p>
    </div>
  );
}
