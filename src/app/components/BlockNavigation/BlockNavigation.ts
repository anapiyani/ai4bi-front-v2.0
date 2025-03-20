import { useEffect } from "react"

const BlockNavigation = () => {
  useEffect(() => {
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    const handleForward = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("forward", handleForward);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("forward", handleForward);
    };
  }, []);

  return null;
};

export default BlockNavigation;
