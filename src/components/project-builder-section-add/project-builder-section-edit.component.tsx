import { ProjectBuilderSectionEditComponentProps } from "./project-builder-section-edit.type";

const ProjectBuilderSectionEditComponent = (
  props: ProjectBuilderSectionEditComponentProps
) => {
  let { section } = props;
  return <div>{section?.section_name}</div>;
};

export default ProjectBuilderSectionEditComponent;
