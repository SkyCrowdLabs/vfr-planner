"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { signup } from "../login/actions";
import Image from "next/image";
import Button from "@/components/Button";
import Link from "next/link";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast, { Toaster } from "react-hot-toast";
import clsx from "clsx";

export interface SignupInput {
  email: string;
  password: string;
  confirmPassword: string;
}

const schema = yup
  .object({
    email: yup
      .string()
      .email("Must be a valid email")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup
      .string()
      .test("passwords-match", "Passwords must match", function (value) {
        return this.parent.password === value;
      })
      .required(),
  })
  .required();

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignupInput>({ mode: "onBlur", resolver: yupResolver(schema) });
  const onSubmit: SubmitHandler<SignupInput> = async (data) => {
    const error = await signup(data);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(
      "Successful signup. Please check your inbox to confirm your email address.",
      {
        duration: 5000,
      }
    );
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Link href="/">
            <Image
              src="/images/favicon-32x32.png"
              alt="airplane emoji"
              className="w-10 h-auto mx-auto"
              width={40}
              height={40}
            />
          </Link>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  {...register("email")}
                  autoComplete="email"
                  className={clsx({
                    "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6":
                      true,
                    "ring-red-400": errors.email,
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-1 ml-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  {...register("password")}
                  type="password"
                  autoComplete="new-password"
                  className={clsx({
                    "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6":
                      true,
                    "ring-red-400": errors.password,
                  })}
                />
              </div>
              {errors.password && (
                <p className="mt-1 ml-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  {...register("confirmPassword")}
                  type="password"
                  autoComplete="new-password"
                  required
                  className={clsx({
                    "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6":
                      true,
                    "ring-red-400": errors.confirmPassword,
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 ml-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Button isLoading={isSubmitting}>
                <input type="submit" />
              </Button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already a member?{" "}
            <a
              href="/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
      <Toaster />
    </>
  );
}
