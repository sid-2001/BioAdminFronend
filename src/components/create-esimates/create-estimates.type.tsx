interface CreateProjectProps {
    open: boolean;
    handleClose: () => void;
    getProjectRetriveByID: () => Promise<void>;
  }

interface EditProjectProps {
  open: boolean;
  effortId:number ;
  handleClose: () => void;
  getProjectRetriveByID: () => Promise<void>;
  editData: any;
}
  
  interface IFormProject {
    cost: string;
    title: string;
    description: string;
    effort: number | null;
    thread_id: number | null;
    // market_id: number[];
    // status_id: number | null;
    // start_date: string;
    // end_date: string;
    // project_description: string;
    // bb_live_link: string;
    // bb_test_link: string;
    // sp_live_link: string;
    // sp_test_link: string;
    // programming_software: number | null;
    // sp_document_url: string;
  
    // schema_url?: string;
    // xml_url?: string;
  }
  
  export type { CreateProjectProps, EditProjectProps, IFormProject };
  