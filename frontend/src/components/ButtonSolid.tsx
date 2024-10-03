import { ButtonType } from '../types';

const ButtonSolid = ({ width, text, onClick }: ButtonType) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      style={{ width: width || '24rem' }}
      className="text-xl py-3 px-10 bg-[rgba(22,45,58,1)] border border-[rgba(22,45,58,1)] rounded-lg text-white text-center max-w-full cursor-pointer hover:bg-[rgba(40,60,80,1)] transition-all">
      {text}
    </button>
  );
};

export default ButtonSolid;
