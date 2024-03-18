const Logo = () => (
  <h1 className={ "flex flex-col justify-center items-center py-4 mb-4" }>
    <img src={ "/assets/images/Logo.webp" } alt={ "ロゴ" } className={ "w-[120px] md:w-[200px] h-auto" }/>
    <span className={ "text-10ptr md:text-14ptr whitespace-nowrap" }>ふくいの魚つながるアプリ</span>
  </h1>
);
export default Logo;