interface ErrorMessageProps {
  error: string;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className="p-4 rounded-xl shadow transition-colors bg-red-50 dark:bg-red-900">
      <p className="text-red-700 dark:text-red-300">{error}</p>
    </div>
  );
}
