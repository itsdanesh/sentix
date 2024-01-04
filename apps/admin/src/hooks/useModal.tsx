import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import Modal from "react-modal";

const customStyles: Modal.Styles = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
		padding: 0,
		border: "none",
	},
	overlay: {
		backgroundColor: "black",
		background: "none",
	},
};

export const useModal = ({
	Content,
}: {
	Content:
		| ReactNode
		| ((context: {
				isOpen: boolean;
				setIsOpen: Dispatch<SetStateAction<boolean>>;
				toggleOpen: () => void;
		  }) => ReactNode);
}): { Modal: JSX.Element; isOpen: boolean; toggleOpen: () => void } => {
	const [isOpen, setIsOpen] = useState(false);
	const handleCloseModal = () => setIsOpen(false);
	const toggleOpen = () => setIsOpen((_open) => !_open);

	const Element = (
		<Modal
			isOpen={isOpen}
			onRequestClose={handleCloseModal}
			style={customStyles}
		>
			{typeof Content == "function"
				? Content({ isOpen, setIsOpen, toggleOpen })
				: Content}
		</Modal>
	);
	return { Modal: Element, isOpen, toggleOpen };
};
