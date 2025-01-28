import { useCallback } from "react"

export const useGoToMessage = () => {
  const goToMessage = useCallback((messageId: string) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("highlight");
      setTimeout(() => {
        element.classList.remove("highlight");
      }, 1000); 
    } else {
      console.warn(`Element with ID message-${messageId} not found.`);
    }
  }, []);

  return goToMessage;
};
