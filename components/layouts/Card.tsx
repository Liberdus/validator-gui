import { ReactElement } from "react";

type CardProps = {
  children: ReactElement;
};

export const Card = ({ children }: CardProps) => {
  return (
    <div className="w-full h-full bg-white shadow-lg border border-amber-500 rounded-xl">
      {children}
    </div>
  );
};
