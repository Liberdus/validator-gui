import { useEffect, useState } from "react";
import { useNodeVersion } from "../../hooks/useNodeVersion";
import Link from "next/link";
import { onboardingCompletedKey } from "../../pages/onboarding";
import { XMarkIcon } from "@heroicons/react/24/outline";
import greyLogo from "../../assets/grey-logo.svg";
import useNotificationsStore, {
  NotificationSeverity,
  NotificationType,
} from "../../hooks/useNotificationsStore";

const newGuiVersionAvailableKey = "newGuiVersionAvailable";
const newValidatorVersionAvailableKey = "newValidatorVersionAvailable";

const VERSION_UPDATE_REPOSITORY_URL =
  process.env.VERSION_UPDATE_REPOSITORY_URL ??
  "https://github.com/liberdus/validator-dashboard";

export const InformationPopupsDisplay = () => {
  const { addNotification } = useNotificationsStore((state: any) => ({
    addNotification: state.addNotification,
  }));
  const { version } = useNodeVersion();

  useEffect(() => {
    const newGuiAvailable =
      (version?.runningCliVersion || 0) < (version?.latestCliVersion || 0);
    const newValidatorAvailable =
      (version?.runnningValidatorVersion || 0) <
      (version?.activeLiberdusVersion || 0);

    if (newGuiAvailable) {
      addNotification({
        type: NotificationType.VERSION_UPDATE,
        severity: NotificationSeverity.ATTENTION,
        title: "New GUI version available",
      });

      const wasNewGuiVersionPreviouslyAvailable =
        localStorage.getItem(newGuiVersionAvailableKey) === "true";
      if (!wasNewGuiVersionPreviouslyAvailable) {
        // user viewing this for the first time
        setShowGuiUpdatePrompt(true);
        localStorage.setItem(newGuiVersionAvailableKey, "true");
        //TODO: if it's not in pending notifications, add it to pending notifications
      }
    } else {
      const wasNewGuiVersionPreviouslyAvailable =
        localStorage.getItem(newGuiVersionAvailableKey) === "true";
      if (wasNewGuiVersionPreviouslyAvailable) {
        localStorage.removeItem(newGuiVersionAvailableKey);
        setShowGuiUpdated(true);
        setShowGuiUpdatePrompt(false);
        addNotification({
          type: NotificationType.VERSION_UPDATE,
          severity: NotificationSeverity.SUCCESS,
          title: `Your GUI version has been updated to Version: ${version?.runningCliVersion}`,
        });
      }
    }

    if (newValidatorAvailable) {
      addNotification({
        type: NotificationType.VERSION_UPDATE,
        severity: NotificationSeverity.ATTENTION,
        title: "New Validator version available",
      });

      const wasNewValidatorVersionPreviouslyAvailable =
        localStorage.getItem(newValidatorVersionAvailableKey) === "true";
      if (!wasNewValidatorVersionPreviouslyAvailable) {
        // user viewing this for the first time
        setShowValidatorUpdatePrompt(true);
        localStorage.setItem(newValidatorVersionAvailableKey, "true");
        //TODO: if it's not in pending notifications, add it to pending notifications
      }
    } else {
      const wasNewValidatorVersionPreviouslyAvailable =
        localStorage.getItem(newValidatorVersionAvailableKey) === "true";
      if (wasNewValidatorVersionPreviouslyAvailable) {
        localStorage.removeItem(newValidatorVersionAvailableKey);
        setShowValidatorUpdated(true);
        setShowValidatorUpdatePrompt(false);
        addNotification({
          type: NotificationType.VERSION_UPDATE,
          severity: NotificationSeverity.SUCCESS,
          title: `Your validator version has been updated to Version: ${version?.runnningValidatorVersion}`,
        });
      }
    }
  }, [version]);

  const [showGuiUpdatePrompt, setShowGuiUpdatePrompt] = useState(false);
  const [showValidatorUpdatePrompt, setShowValidatorUpdatePrompt] =
    useState(false);
  const [showGuiUpdated, setShowGuiUpdated] = useState(false);
  const [showValidatorUpdated, setShowValidatorUpdated] = useState(false);

  const isOnboardingCompleted =
    localStorage.getItem(onboardingCompletedKey) === "true";

  const [showOnboardingPrompt, setShowOnboardingPrompt] = useState(
    !isOnboardingCompleted
  );

  return (
    <div className="flex flex-col gap-y-3">
      {showOnboardingPrompt && (
        <div className="w-full h-full rounded-xl p-4 bg-amber-400 max-md:hidden">
          <div className="flex">
            <div className="flex flex-col grow gap-x-3">
              <span className="text-md font-semibold">
                Finish setting up your node
              </span>
              <div className="flex justify-start mt-3">
                <span className="bodyFg text-sm">
                  Start your node, add stake and begin validating.
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-start">
              <XMarkIcon
                className="h-8 w-8 p-2 m-[-0.5rem] cursor-pointer rounded-lg hover:bg-black/10"
                onClick={() => {
                  localStorage.setItem(onboardingCompletedKey, "true");
                  setShowOnboardingPrompt(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
      {!showOnboardingPrompt && (
        <span className="text-4xl font-semibold mt-16">
          Welcome, validator!
        </span>
      )}
      {showValidatorUpdatePrompt && (
        <div className="w-full h-full border border-attentionBorder bg-attentionBg rounded-xl p-4">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <span className="font-semibold text-xs">
                New validator version available
              </span>
              <span className="bodyFg font-light text-xs">
                A new validator version (V {version?.minLiberdusVersion}) is
                available and ready to update.
              </span>
            </div>
            <div className="flex justify-end gap-x-3 w-full mt-2">
              <button
                className="text-xs px-3 py-2"
                onClick={() => {
                  setShowValidatorUpdatePrompt(false);
                }}
              >
                Dismiss
              </button>
              <Link
                href={VERSION_UPDATE_REPOSITORY_URL}
                onClick={() => {
                  setShowValidatorUpdatePrompt(false);
                }}
                target="_blank"
                className="flex justify-center items-center bg-white border border-gray-300 rounded-xl text-xs font-semibold w-24 py-1"
              >
                Update
              </Link>
            </div>
          </div>
        </div>
      )}
      {showGuiUpdatePrompt && (
        <div className="w-full h-full border border-attentionBorder bg-attentionBg rounded-xl p-4">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <span className="font-semibold text-xs">
                New GUI version available
              </span>
              <span className="bodyFg font-light text-xs">
                A new GUI version (V {version?.latestCliVersion}) is available
                and ready to update.
              </span>
            </div>
            <div className="flex justify-end gap-x-3 w-full mt-2">
              <button
                className="text-xs px-3 py-2"
                onClick={() => {
                  setShowGuiUpdatePrompt(false);
                }}
              >
                Dismiss
              </button>
              <Link
                href={VERSION_UPDATE_REPOSITORY_URL}
                onClick={() => {
                  setShowGuiUpdatePrompt(false);
                }}
                target="_blank"
                className="flex justify-center items-center bg-white border border-gray-300 rounded-xl text-xs font-semibold w-24 py-1"
              >
                Update
              </Link>
            </div>
          </div>
        </div>
      )}
      {showValidatorUpdated && (
        <div className="w-full h-full border border-successBorder bg-successBg rounded-xl p-4">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <span className="font-semibold text-xs">
                Validator version has been updated
              </span>
              <span className="bodyFg font-light text-xs">
                Your validator has been updated to Version{" "}
                {version?.runnningValidatorVersion} and is ready to be used.
              </span>
            </div>
            <div className="flex justify-end gap-x-3 w-full">
              <button
                className="text-xs px-3 py-2"
                onClick={() => {
                  setShowValidatorUpdated(false);
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
      {showGuiUpdated && (
        <div className="w-full h-full border border-successBorder bg-successBg rounded-xl p-4">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <span className="font-semibold text-xs">
                GUI version has been updated
              </span>
              <span className="bodyFg font-light text-xs">
                Your validator has been updated to Version{" "}
                {version?.runningCliVersion} and is ready to be used.
              </span>
            </div>
            <div className="flex justify-end gap-x-3 w-full">
              <button
                className="text-xs px-3 py-2"
                onClick={() => {
                  setShowGuiUpdated(false);
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
