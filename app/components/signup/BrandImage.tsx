import { ComponentProps } from "react";

const BrandImage = ({ ...props }: ComponentProps<"img">) => {
  return (
    <figure className={ "block relative w-full pt-[66.7%] bg-black" }>
      <img 
        { ...props } 
        loading={ "eager" } 
        className={ "absolute top-0 left-0 w-full h-full object-cover opacity-50" }
      />
    </figure>
  );
};
export default BrandImage;