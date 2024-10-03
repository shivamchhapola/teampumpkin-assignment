import { ButtonType } from '../types';

const ButtonHollow = ({ width, text, onClick }: ButtonType) => {
  return (
    <div
      onClick={() => onClick?.()}
      style={{ width: width || '24rem' }}
      className="text-xl py-3 px-10 border border-[rgba(22,45,58,1)] rounded-lg text-[rgba(22,45,58,1)] text-center max-w-full cursor-pointer hover:bg-gray-100 transition-all">
      {text}
    </div>
  );
};

export default ButtonHollow;
