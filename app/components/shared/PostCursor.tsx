import { Link } from "@remix-run/react";
import { IconMessageDots } from "@tabler/icons-react";

export default function PostCursor() {
  return (
    <Link
      to={ "/post/add" }
      className={ "fixed bottom-8 right-8 w-24 h-24 flex justify-center items-center border-solid border-[3px] border-black rounded-full cursor-pointer z-[100]" }
    >
      <IconMessageDots className={ "w-12 h-12 text-black" } color={ "black" }/>
    </Link>
  );
}