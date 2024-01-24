import { ComponentProps } from "react";

interface SubmittingProps extends ComponentProps<"div"> {
  state: string;
}
export default function Submitting ({ ...props }: SubmittingProps) {
  return (
    <>
      { props.state === "submitting" &&
      <div className={ "loading fixed top-0 left-0 w-full h-[100vh] z-10 bg-white bg-opacity-50 select-none" }>
        <div className={ "flex justify-center items-center w-full h-full" }>
          <p className={ "text-36ptr md:text-40ptr text-gray-600 font-bold" }>送信しています...</p>
        </div>
      </div>
      }
    </>
  );
};