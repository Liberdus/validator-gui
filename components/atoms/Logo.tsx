import Image from "next/image";
import logo from "../../assets/liberdus-with-text.png";
import minimalLogo from "../../assets/liberdus.png";

type LogoProps = {
  className?: string;
  isMinimalLogo?: boolean;
};

export const Logo: React.FC<LogoProps> = ({
  className,
  isMinimalLogo = false,
}: LogoProps) => {
  return (
    <>
      {!isMinimalLogo && (
        <Image
          className={className || "w-16"}
          src={logo}
          alt="Liberdus Logo"
          priority
        />
      )}
      {isMinimalLogo && (
        <Image
          className={className || "w-32"}
          src={minimalLogo}
          alt="Liberdus Logo"
          priority
        />
      )}
    </>
  );
};
