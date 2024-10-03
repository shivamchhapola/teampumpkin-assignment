import Logowithtext from '../assets/logowithtext.png';

const Navbar = () => {
  return (
    <div className="w-screen px-8 py-7 shadow-lg">
      <div className="h-[2.5rem]">
        <img src={Logowithtext} alt="Logo" className="h-full" />
      </div>
    </div>
  );
};

export default Navbar;
