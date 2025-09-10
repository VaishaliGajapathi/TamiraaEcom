import { LuMinus, LuPlus } from 'react-icons/lu';

interface IncreDreProps {
  count: number;
  onChange: (q: number) => void;
}

export default function IncreDre({ count, onChange }: IncreDreProps) {
  return (
    <div className="inc-dec flex items-center gap-2">
      <div
        className="dec w-6 h-6 bg-[#E8E9EA] dark:bg-dark-secondary flex items-center justify-center cursor-pointer"
        onClick={() => onChange(count > 0 ? count - 1 : 0)}
      >
        <LuMinus className="text-title dark:text-white" />
      </div>
      <input
        className="w-6 h-auto outline-none bg-transparent text-base mg:text-lg leading-none text-title dark:text-white text-center"
        type="text"
        value={count}
        onChange={(e) => {
          const value = Number(e.target.value) || 0;
          onChange(value);
        }}
      />
      <div
        className="inc w-6 h-6 bg-[#E8E9EA] dark:bg-dark-secondary flex items-center justify-center cursor-pointer"
        onClick={() => onChange(count + 1)}
      >
        <LuPlus className="text-title dark:text-white" />
      </div>
    </div>
  );
}