import { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
// import { useParams } from "react-router-dom";

import ProjectThreadsList from "@/components/project-threads-list";
import ProjectThreadChatComponent from "@/components/project-thread-chat";
import ProjectThreadHOC from "@/higher-order-components/project-thread";
import { ProjectThreadsContainerPropTypes } from "@/higher-order-components/project-thread/project-thread.hoc";

function ProjectThreadsContainer({
  postProjectThread,
  postThread,
  projectThreads,
  selectedThread,
  setSelectedThread,
  threadCardClickHandler,
}: ProjectThreadsContainerPropTypes) {
  const [showThreadsPanel, setShowThreadsPanel] = useState(false);

  function closeThreadsPanel() {
    setShowThreadsPanel(false);
  }

  function submitHandler(e: any) {
    e.preventDefault();

    postProjectThread(e.target[0].value);
  }

  useEffect(() => {
    console.log("Selected Thread changed");
    console.log(selectedThread);
  }, [selectedThread]);

  return (
    <>
      <Drawer
        anchor={"right"}
        open={showThreadsPanel}
        onClose={closeThreadsPanel}
        sx={{
          display: "block",
          overflowY: "scroll",
        }}
        style={{ display: "block" }}
      >
        {selectedThread === null ? (
          <List>
            <ProjectThreadsList
              projectThreads={projectThreads}
              selectedThread={selectedThread}
              threadCardClickHandler={threadCardClickHandler}
            />
          </List>
        ) : (
          //@ts-ignore
          <ProjectThreadChatComponent
            thread={selectedThread}
            setSelectedThread={setSelectedThread}
            postThread={postThread}
            updateThreadStatus={undefined}
            updateThreadTitle={undefined}
          />
        )}
      </Drawer>
      <Button
        variant="contained"
        onClick={() => setShowThreadsPanel((prev) => !prev)}
      >
        Toggle
      </Button>
      <form onSubmit={submitHandler}>
        <input type="text" />
      </form>
    </>
  );
}

export default ProjectThreadHOC(ProjectThreadsContainer);
