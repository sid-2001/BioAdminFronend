import { ModalContentProps } from "./modal-content.type";
import { Content, PageWrapper } from "./modal-content.style";
 
const ModalContent = (props: ModalContentProps) => {
  const { children } = props;
 
  return (
    <PageWrapper>
      <Content>{children}</Content>
    </PageWrapper>
  );
};
 
export default ModalContent;