import { Link } from "@remix-run/react";
import { IconMessageDots } from "@tabler/icons-react";

export default function PostCursor() {
  return (
    <Link
      to={ "/home/newspost" }
      className={ "group fixed bottom-24 md:bottom-8 right-2 md:right-8 w-20 md:w-24 h-20 md:h-24 flex justify-center items-center border-solid border-[3px] border-gray-500 hover:border-[#003371] rounded-full bg-white/70 cursor-pointer z-[100]" }
    >
      <IconMessageDots className={ "w-10 md:w-12 h-10 md:h-12 text-gray-500 group-hover:text-[#003371]" } />
    </Link>
  );
}