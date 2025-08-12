import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { useSettings } from "../../hooks/useSettings";

let walletWindow: Window | null = null;

const getWalletUrl = (network?: string) => {
  if (network === "testnet") {
    return "https://liberdus.com/test/";
  }
  return "https://liberdus.com/dev/";
};

const openWallet = (walletUrl: string, windowName: string) => {
  if (walletWindow && !walletWindow.closed) {
    walletWindow.focus();
  } else {
    walletWindow = window.open(walletUrl, windowName);
    walletWindow?.focus();
  }
};

export const WalletConnectButton = ({ stake = false }) => {
  const { settings } = useSettings();
  const currentNetwork = settings?.currentNetwork || "default";
  const walletUrl = getWalletUrl(currentNetwork);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    openWallet(walletUrl, `liberdus_wallet_${currentNetwork}`);
  };

  return (
    <button
      className="w-full px-4 py-2 text-sm text-white font-bold rounded-full bg-blue-700 hover:bg-blue-600 active:bg-blue-800 flex place-content-center items-center"
      onClick={handleClick}
      type="button"
    >
      {stake ? "Stake via Liberdus Wallet" : "Go to Liberdus Wallet"}
      <ArrowTopRightOnSquareIcon className="inline h-4 w-5 ms-1" />
    </button>
  );
};

export const WalletConnectButtonMobile = () => {
  const { settings } = useSettings();
  const currentNetwork = settings?.currentNetwork || "default";
  const walletUrl = getWalletUrl(currentNetwork);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    openWallet(walletUrl, `liberdus_wallet_${currentNetwork}`);
  };

  return (
    <button
      className="px-2 py-2 text-xs text-white font-semibold rounded-full bg-blue-700 hover:bg-blue-600 active:bg-blue-800 flex place-content-center items-center"
      onClick={handleClick}
      type="button"
    >
      Liberdus Wallet
      <ArrowTopRightOnSquareIcon className="inline h-4 w-5 ms-1" />
    </button>
  );
};
