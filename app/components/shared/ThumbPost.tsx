import { Link, LinkProps } from "@remix-run/react";;
import { FaRegCommentAlt, FaCommentAlt  } from "react-icons/fa";
import { TbStar, TbStarFilled } from "react-icons/tb";

interface ThumbPostProps extends LinkProps {
  isLiked?: boolean;
  isCommented?: boolean;
  likeCount?: number;
  commentCount?: number;
  title?: string;
  nickname?: string;
  imgPath?: string;
  uploadsUrl?: string;
}
const ThumbPost = ({ ...props }: ThumbPostProps) => (
  <Link to={ props.to } className={ "flex flex-col gap-2 relative cursor-pointer hover:opacity-80" }>
    <figure className={ "block relative w-full pt-[50.0%] md:pt-[50.0%]" }>
      { (props.imgPath && props.uploadsUrl) 
      ?
      <img src={ props.uploadsUrl + props.imgPath } alt={ props.title } className={ "absolute top-0 left-0 w-full h-full object-cover rounded-md " }/>
      :
      <img src={ "/assets/images/Noimage.png" } alt={ "NoImage" } className={ "absolute top-0 left-0 w-full h-full object-cover rounded-md " }/>
      }
    </figure>
    <p className={ "text-black text-14ptr md:text-18ptr font-semibold" }>
      { props.title || "記事タイトル" }
    </p>
    <p className={ "text-gray-500 leading-none" }>{ props.nickname || "ニックネーム" }</p>
    <div className={ "flex justify-start items-center gap-4" }>
      <div className={ "flex justify-start items-center gap-2" }>
        {  props.isLiked && <TbStarFilled className={ "text-[#003371]" }/> }
        { !props.isLiked && <TbStar className={ "text-gray-500" }/> }
        <span className={ props.isLiked ? "text-[#003371]" : "text-gray-500" }>{ props.likeCount || 0 }</span>
      </div>
      <div className={ "flex justify-start items-center gap-2" }>
        {  props.isCommented && <FaCommentAlt className={ "text-[#003371]" }/> }
        { !props.isCommented && <FaRegCommentAlt className={ "text-gray-500" }/> }
        <span className={ props.isCommented ? "text-[#003371]" : "text-gray-500" }>{ props.commentCount || 0 }</span>
      </div>
    </div>
  </Link>
);
export default ThumbPost;