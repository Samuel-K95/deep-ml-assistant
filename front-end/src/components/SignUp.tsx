import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  email: string;
  password: string;
  confirm: string;
};

const SignUp = () => {
  const { register, handleSubmit, formState, watch } = useForm<Inputs>();
  const { errors } = formState;

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <div className="w-full flex flex-col items-center">
      <h2>Create an account</h2>
      <p className="text-gray-400">
        Enter your email and password below to create your account
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[25%] flex flex-col gap-5 p-5"
      >
        <input
          type="email"
          id="email"
          placeholder="name@example.com"
          className="bg-transparent text-white border-solid border-gray-300 border-2 rounded-lg text-[12px] p-2 pl-5"
          {...register("email", {
            required: {
              value: true,
              message: "Email can't be empty",
            },
            pattern: {
              value: /[a-zA-Z0-9.*%±]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}/,
              message: "Incorrect email format",
            },
          })}
        />
        <p className="inputErrors">{errors.email?.message}</p>

        <input
          type="password"
          id="password"
          placeholder="Enter password"
          className="bg-transparent text-white border-solid border-gray-300 border-2 rounded-lg text-[12px] p-2 pl-5"
          {...register("password", {
            required: {
              value: true,
              message: "Password is required",
            },
            minLength: 6,
          })}
        />
        <p className="inputErrors">{errors.password?.message}</p>

        <input
          type="password"
          id="confirm"
          placeholder="Confirm password"
          className="bg-transparent text-white border-solid border-gray-300 border-2 rounded-lg text-[12px] p-2 pl-5"
          {...register("confirm", {
            required: {
              value: true,
              message: "Confirm password is required",
            },
            validate: (val: string) => {
              if (watch("password") != val) {
                return "Your password doesn't match";
              }
            },
          })}
        />
        <p className="inputErrors">{errors.confirm?.message}</p>

        <input
          type="submit"
          value="Submit"
          className="bg-green-700 rounded-md p-3 text-white border-none text-[16px] font-bold cursor-pointer"
        />
      </form>
      <p className="font-medium">
        Already have an account?{" "}
        <span className="text-blue-400">
          <a href="">Sign In</a>
        </span>
      </p>
    </div>
  );
};

export default SignUp;
