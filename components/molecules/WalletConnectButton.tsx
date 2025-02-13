import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";

export const WalletConnectButton = () => {
  return (
    <a
      className="w-full px-4 py-2 text-sm text-white font-bold rounded-full bg-blue-700 hover:bg-blue-600 active:bg-blue-800 flex place-content-center items-center"
      href="https://test.liberdus.com"
      target="_blank"
    >
      {"Go to Liberdus Wallet"}
      <ArrowTopRightOnSquareIcon className="inline h-4 w-5 ms-1" />
    </a>
  );
};
