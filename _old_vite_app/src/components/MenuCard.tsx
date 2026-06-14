import { ClayButton } from './ClayButton';

export function MenuCard({ color, title, icon, onClick, delay, id }: any) {
  return (
    <ClayButton
      id={id}
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 100, damping: 12 }}
      onClick={onClick}
      colorClass={color}
      className="gap-3 text-sm md:text-base h-40 overflow-hidden pb-4 pt-4 px-3 rounded-[2rem] w-full border-b-[6px]"
    >
      <div className="bg-white/25 p-3 rounded-2.5xl shadow-inner flex items-center justify-center border border-white/20">
        {icon}
      </div>
      <span className="leading-tight font-black tracking-wide text-shadow-sm select-none break-words w-full px-1">{title}</span>
    </ClayButton>
  );
}
