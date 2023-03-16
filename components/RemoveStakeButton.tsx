import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { ToastContext } from './ToastContextProvider';
import { useTXLogs } from "../hooks/useTXLogs";
import LoadingButton from './LoadingButton';
import { ConfirmModalContext } from './ConfirmModalContextProvider';

export default function RemoveStakeButton({nominee, force = false}: { nominee: string, force?: boolean }) {
  const {showTemporarySuccessMessage} = useContext(ToastContext);
  const {openModal} = useContext(ConfirmModalContext);

  const createUnstakeLog = (data: any, params: { data: any }, hash: string, sender: string) => {
    params.data = data
    const logData = {
      tx: params,
      sender,
      txHash: hash
    }

    return logData
  }

  const sendTransaction = async (nominator: string, nominee: string, force: boolean) => {
    const {writeUnstakeLog} = useTXLogs()
    try {
      // @ts-ignore
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const [gasPrice, from, nonce] = await Promise.all([
        signer.getGasPrice(),
        signer.getAddress(),
        signer.getTransactionCount()
      ]);

      const unstakeData = {
        isInternalTx: true,
        internalTXType: 7,
        nominator,
        timestamp: Date.now(),
        nominee,
        force
      };
      console.log("Unstake Data", unstakeData);

      const params = {
        from,
        to: "0x0000000000000000000000000000000000000001",
        gasPrice,
        gasLimit: 30000000,
        data: ethers.utils.hexlify(
          ethers.utils.toUtf8Bytes(JSON.stringify(unstakeData))
        ),
        nonce
      };
      console.log("Params: ", params);

      const {hash, data, wait} = await signer.sendTransaction(params);
      console.log("TX RECEIPT: ", {hash, data});
      await writeUnstakeLog(createUnstakeLog(unstakeData, params, hash, from))

      const txConfirmation = await wait();
      console.log("TX CONFRIMED: ", txConfirmation);
      showTemporarySuccessMessage('Remove stake successful!');
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const [haveMetamask, sethaveMetamask] = useState(false);
  const [accountAddress, setAccountAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // @ts-ignore
    const {ethereum} = window;
    const checkMetamaskAvailability = async () => {
      if (!ethereum) {
        sethaveMetamask(false);
      } else sethaveMetamask(true);
    };
    checkMetamaskAvailability();
  }, []);

  const connectWallet = async () => {
    try {
      // @ts-ignore
      const {ethereum} = window;
      if (!ethereum) {
        sethaveMetamask(false);
      }
      // @ts-ignore
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });

      setAccountAddress(accounts[0]);

      console.log("Account2: ", accountAddress);
      setIsConnected(true);
      await sendTransaction(accounts[0], nominee, force);
    } catch (error) {
      setIsConnected(false);
      setLoading(false);
    }
  };
  // const resultBox = useRef();
  // const [signatures, setSignatures] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [data, setData] = useState({
    isInternalTx: true,
    internalTXType: 7,
    nominator: accountAddress,
    timestamp: Date.now()
  });

  // @ts-ignore
  window.ethereum?.on("accountsChanged", (accounts: any) => {
    setData({...data, nominator: accounts[0]});
  });

  async function removeStake() {
    setLoading(true);
    await connectWallet();
  }

  const handleRemoveStake = () => {
    if (force) {
      openModal({
        header: 'Force Remove Stake',
        modalBody: <>
          You are about to force remove your staked funds. This can be used to retrieve stake that is otherwise
          stuck.
          <br/>
          <span className='font-semibold'>WARNING</span>: Pending rewards can get lost when using this option!
        </>,
        onConfirm: () => removeStake()
      });

    } else {
      removeStake()
    }
  }

  return (
    <>
      {haveMetamask ? (
        <>
          <div>
            <LoadingButton className="btn btn-primary" isLoading={isLoading}
                           onClick={() => handleRemoveStake()}>
              Remove Stake
              <ArrowRightIcon className="h-5 w-5 inline ml-2"/>
            </LoadingButton>
          </div>
        </>
      ) : (
        <div className="text-red-500">Please install a Web3 Wallet</div>
      )}
    </>
  );
}
