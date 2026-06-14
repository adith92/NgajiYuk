import { ClayButton } from './ClayButton';

export function MenuCard({ color, title, icon, onClick, delay, id }: any) {
  return (
    <ClayButton
      id={id}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 120 }}
      onClick={onClick}
      colorClass={color}
      className="gap-3 text-sm md:text-base h-36 overflow-hidden pb-5"
    >
      <div className="bg-white/20 p-2.5 rounded-2.5xl shadow-inner flex items-center justify-center">
        {icon}
      </div>
      <span className="leading-tight break-keep">{title}</span>
    </ClayButton>
  );
}
