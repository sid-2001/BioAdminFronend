// import api1 from "./apis/api1";

function sleep() {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

const DUMMY_DATA = ["Hello World", "Hello World", "Hello World"];

class DemoService {
  static async getDemoList() {
    try {
      await sleep();

      return DUMMY_DATA;
    } catch (error) {
      throw error;
    }
  }
}

export default DemoService;
