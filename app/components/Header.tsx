import Logo from "./Logo";

const Header = () => (
  <header className={ "h-32 mb-8 pt-8" }>
    <div className={ "container flex justify-center items-center h-full " }>
      <Logo/>
    </div>
  </header>
);
export default Header;