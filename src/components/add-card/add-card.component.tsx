import { StyledCard } from "./add-card.style";
import { AddCardProps } from "./add-card.type";
import { AddIcon } from "@/assets/images";

const AddCard = (props: AddCardProps) => {
  let { handleClick, height, width } = props;
  return (
    <StyledCard
      onClick={handleClick}
      sx={{ height: height ? height : "170px", width: width ? width : "300px" }}
    >
      <img src={AddIcon} />
    </StyledCard>
  );
};

export default AddCard;
