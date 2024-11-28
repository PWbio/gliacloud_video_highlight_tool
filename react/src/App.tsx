import { store } from "@/redux/store";
import { App as AntdApp } from "antd";
import { Provider as ReduxProvider } from "react-redux";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <ReduxProvider store={store}>
      <AntdApp
        notification={{ maxCount: 3, duration: 3, placement: "bottomRight" }}
      >
        <HomePage />
      </AntdApp>
    </ReduxProvider>
  );
}

export default App;
