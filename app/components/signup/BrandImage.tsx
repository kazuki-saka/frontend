import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const BrandImage = ({ ...props }: ComponentProps<"img">) => {
  // Render
  return (
    <figure className={ twMerge("block relative w-full pt-[66.7%] bg-black", props.className) }>
      <img 
        { ...props } 
        alt={ props.alt }
        loading={ "eager" } 
        className={ "absolute top-0 left-0 w-full h-full object-cover opacity-50" }
      />
    </figure>
  );
};
export default BrandImage;