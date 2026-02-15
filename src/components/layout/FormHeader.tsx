interface FormHeaderProps {
  title: string;
  subtitle?: string;
  helpText?: string;
}

export function FormHeader({ title, subtitle, helpText }: FormHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl font-heading font-semibold text-gray-900">{title}</h1>

      {subtitle && (
        <p className="text-sm sm:text-base font-body text-gray-600 mt-2">{subtitle}</p>
      )}

      {helpText && (
        <div className="mt-4 p-3 sm:p-4 bg-info-50 border-l-4 border-info-500 rounded-lg">
          <p className="text-sm font-body text-gray-800">{helpText}</p>
        </div>
      )}
    </div>
  );
}
