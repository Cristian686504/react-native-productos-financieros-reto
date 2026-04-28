export type DeleteProductModalProps = {
  visible: boolean;
  productName: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};
