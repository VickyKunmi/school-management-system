import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  hidden?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  rightIcon?: React.ReactNode;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  hidden,
  inputProps,
  rightIcon,
}: InputFieldProps) => {
  return (
    <div className={hidden ? "hidden" : "flex flex-col gap-2 w-full md:w-1/4"}>
      <label className="text-sm text-gray-500">{label}</label>
      <div className="relative w-full">
      <input
        type={type}
        {...register(name)}
        className="ring-[1.5px] ring-gray-300 p-2  rounded-md text-sm w-full"
        {...inputProps}
        defaultValue={defaultValue}
      />
      {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
            {rightIcon}
          </div>
        )}
        </div>
      {error?.message && (
        <p className="text-xs text-red-400">
          {error?.message.toString()}
        </p>
      )}
    </div>
  );
};

export default InputField;
