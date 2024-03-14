import { Link, LinkProps, useMatches } from "@remix-run/react";

const Navbar = () => {
  // Matches
  const matches = useMatches();
  // Current Path
  const currentPath = matches.slice(-1)[0].pathname;
  return (
    <aside id={ "nav" } className={ "fixed bottom-0 md:top-0 left-0 w-full md:w-[100px] h-[80px] md:h-screen border-solid border-[1px] border-r-gray-400 bg-white z-10" }>
      <div className={ "grid grid-cols-4 h-full md:flex md:flex-col md:gap-16 md:pt-8" }>
        <_Tab to={ "/home" } title={ "ホーム" } icon={ "icon1" } active={ currentPath === "/home/" }/>
        <_Tab to={ "/home/pickup" } title={ "魚種別" } icon={ "icon2" } active={ currentPath.includes("/home/pickup") || currentPath.includes("/home/reportview") }/>
        <_Tab to={ "/likes" } title={ "ほしいね" } icon={ "icon3" } active={ currentPath.includes("/home/likes") }/>
        <_Tab to={ "/account" } title={ "アカウント" } icon={ "icon4" } active={ currentPath.includes("/home/account") }/>
      </div>
    </aside>
  );
};
export default Navbar;

interface IconProps extends LinkProps {
  icon: string;
  title: string;
  active?: boolean;
}
const _Tab = ({ ...props }: IconProps) => {
  // Props
  const { icon, title, active, ...others } = props;
  return (
    <Link { ...others } className={ "flex flex-col justify-center items-center gap-0 md:gap-2" }>
      { active 
      ?
      <>
        <img src={ `/assets/images/navbar/${ icon }-blue.svg` } alt={ title } className={ "h-8 md:h-auto w-8" }/>
        <span className={ "inline-block text-[#003371] text-center font-medium whitespace-nowrap" }>{ title }</span>
      </>
      :
      <>
        <img src={ `/assets/images/navbar/${ icon }-gray.svg` } alt={ title } className={ "h-8 md:h-auto w-8" }/>
        <span className={ "inline-block text-gray-500 text-center font-medium whitespace-nowrap" }>{ title }</span>
      </>
      }
    </Link>
  );
};