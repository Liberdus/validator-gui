import { InformationCircleIcon } from "@heroicons/react/20/solid";

export default function StatusBadge({ status }: { status: string }) {
  const statusTip = new Map<string, string>(
    Object.entries({
      active:
        "Your node is part of Active validator group. You will start receiving rewards for being an active validator. The network will swap your node back to Standby at an appropriate time.",
      standby:
        "Your node is connected to the network. It is in a Standby Pool and each cycle it has a chance to be randomly selected to go into Validating state",
      stopped: "Your node is not running and not participating in the network.",
      syncing:
        "This node is syncing with the network and will begin validating transactions soon.",
      "need-stake":
        "Your node is running, but it will not join the network until you stake.",
      "waiting-for-network":
        "Node is trying to connect to the Shardeum network. If your node is stuck in this for more than 5 minutes then please contact us so we can debug and solve this.",
    })
  );

  const statusColor = new Map<string, string>(
    Object.entries({
      active: "text-success",
      standby: "text-success",
      syncing: "text-success",
      stopped: "text-error",
      "need-stake": "text-warning",
      "waiting-for-network": "text-warning",
    })
  );

  return (
    <div className="tooltip normal-case" data-tip={statusTip.get(status)}>
      <InformationCircleIcon
        className={`h-5 w-5 mb-1 inline ${statusColor.get(status)}`}
      />
    </div>
  );
}
