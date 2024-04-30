import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import store from "./redux/store";
import routes from "./routes/routes";
function App() {
  return (
    <div className="bg-base-300">
      <Provider store={store}>
        <RouterProvider router={routes} />
      </Provider>
      <ToastContainer />
    </div>
  );
}

export default App;
