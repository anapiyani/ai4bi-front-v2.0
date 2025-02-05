import Icons from '../Icons'

type ContextMenuItemsProps = {
  isSelected: boolean;
  handleReplyClick: () => void;
  handleForward: () => void;
  handlePin: (messageId: string) => void;
  handleUnpin: (messageId: string) => void;
  handleEditClick: () => void;
  handleOpenDeleteMessage: (messageId: string) => void;
  handleSelectMessages: (action: "select" | "unselect" | "select_all" | "unselect_all" | "delete_selected" | "forward_selected") => void;
  t: (key: string) => string;
	isAdmin: boolean;
	isPinned: boolean;
	isOwner: boolean;
	messageId: string;
	selectedMessages: string[];
}


const useContextMenuItems = ({
  isSelected,
  handleReplyClick,
  handleForward,
  handlePin,
  handleUnpin,
  handleEditClick,
  handleOpenDeleteMessage,
  handleSelectMessages,
	t,
	isAdmin,
	isPinned,
	isOwner,
	messageId,
	selectedMessages,
}: ContextMenuItemsProps) => {
	const contextMenuItems = [
    {
      icon: Icons.Reply,
      label: t("reply"),
      show: true && !isSelected,
      action: () => {
        handleReplyClick && handleReplyClick();
      },
    },
    {
      icon: Icons.Forward,
      label: t("forward"),
      show: true && !isSelected,
      action: () => {
        handleForward();
      },
    },
    {
      icon: Icons.Pin,
      label: t("pin"),
      show: isAdmin && !isPinned && !isSelected,
      action: () => {
        handlePin(messageId);
      },
    },
    {
      icon: Icons.UnPin,
      label: t("unpin"),
      show: isAdmin && isPinned && !isSelected,
      action: () => {
        handleUnpin(messageId);
      },
    },
    {
      icon: Icons.Edit,
      label: t("edit"),
      show: isOwner && !isSelected,
      action: () => {
        handleEditClick && handleEditClick();
      },
    },
    {
      icon: Icons.Delete,
      label: t("delete"),
      show: (isAdmin || isOwner) && !isSelected,
      action: () => {
        handleOpenDeleteMessage(messageId);
      },
    },
    {
      icon: Icons.Check,
      label: t("select"),
      show: true && !isSelected,
      action: () => {
        handleSelectMessages("select");
      },
    },
    {
      icon: Icons.Delete,
      label: t("delete_selected"),
      show: isSelected,
      action: () => {
        handleSelectMessages("delete_selected");
      },
    },
    {
      icon: Icons.Forward,
      label: t("forward_selected"),
      show: isSelected,
      action: () => {
        handleSelectMessages("forward_selected");
      },
    },
    {
      icon: Icons.Check,
      label: t("unselect"),
      show: isSelected,
      action: () => {
        handleSelectMessages("unselect");
      },
    },
    {
      icon: Icons.Check,
      label: t("unselect_all"),
      show: isSelected && selectedMessages.length > 1,
      action: () => {
        handleSelectMessages("unselect_all");
      },
    },
  ].filter((item) => item.show);
	return contextMenuItems;
}

export default useContextMenuItems;