interface FormHeaderProps {
  title: string;
  subtitle?: string;
  helpText?: string;
}

export function FormHeader({ title, subtitle, helpText }: FormHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{title}</h1>

      {subtitle && (
        <p className="text-sm sm:text-base text-gray-600 mt-2">{subtitle}</p>
      )}

      {helpText && (
        <div className="mt-4 p-3 sm:p-4 bg-info-50 border border-info-500 rounded-md">
          <p className="text-sm text-gray-800">{helpText}</p>
        </div>
      )}
    </div>
  );
}
