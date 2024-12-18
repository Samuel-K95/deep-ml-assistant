import { useForm, SubmitHandler } from "react-hook-form";
import { NavLink } from "react-router";

type Inputs = {
  email: string;
  password: string;
};

const SignIn = () => {
  const { register, handleSubmit, formState } = useForm<Inputs>();
  const { errors } = formState;

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  let getToken = async () => {
    let response = await fetch(
      "http://127.0.0.1:8000/api/user/auth/get_token/",
      {
        method: "GET",
      }
    );

    if (response.status === 200) {
      return response;
    }

    return "";
  };

  const handleSignIn = async () => {
    let response = await fetch("http://127.0.0.1:8000/accounts/github/login/", {
      method: "GET",
    });

    if (response.status === 200) {
      let access_token = await getToken();

      if (access_token != "") {
        console.log("accesstoken", access_token);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col w-full itmes-center text-gray-400 gap-5">
        <h1 className="text-lg font-bold flex justify-around">
          Deep-ML Assistant
        </h1>
        <div className="w-full flex flex-col items-center text-gray-400">
          <div className="flex w-full items-center justify-center gap-5">
            <div className="h-[0.5px] bg-gray-400 border-solid w-1/12 rounded-lg"></div>
            <h2>Sign In using email</h2>
            <div className="h-[0.5px] bg-gray-400 border-solid w-1/12 rounded-lg"></div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-[25%] flex flex-col gap-5 p-5"
          >
            <input
              type="email"
              id="email"
              placeholder="name@example.com"
              className="bg-transparent text-white border-solid border-gray-300 border-[1px] rounded-lg text-[12px] p-2 pl-5"
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
              className="bg-transparent text-white border-solid border-gray-300 border-[1px] rounded-lg text-[12px] p-2 pl-5"
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
              type="submit"
              value="Sign In"
              className="bg-green-700 rounded-md p-3 text-white border-none text-[16px] font-bold cursor-pointer hover:bg-green-600"
            />
          </form>

          <div className="flex w-full items-center justify-center gap-5">
            <div className="h-[0.5px] bg-gray-400 border-solid w-1/12 rounded-lg"></div>
            <p className="flex">Or Continue with</p>
            <div className="h-[0.5px] bg-gray-400 border-solid w-1/12 rounded-lg"></div>
          </div>

          <button
            className="flex text-20 gap-5 m-5 w-[25%] bg-[#0f1216] items-center justify-center p-3 rounded-lg hover:bg-[#161B22]"
            onClick={() => handleSignIn}
          >
            <>
              <img
                src="./images/github-sign.png"
                alt="github"
                width={25}
                height={25}
              />
              Github
            </>
          </button>
          <p className="font-medium">
            Don't have an account?{" "}
            <span className="text-blue-400">
              <NavLink to="/register">Sign Up</NavLink>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
