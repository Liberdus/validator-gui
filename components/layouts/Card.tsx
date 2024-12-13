import { ReactElement } from "react";

type CardProps = {
  children: ReactElement;
};

export const Card = ({ children }: CardProps) => {
  return <div className="w-full h-full bg-white rounded-xl">{children}</div>;
};
