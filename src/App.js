import "./App.css";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import routes from "./routes/routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <div>
      <Provider store={store}>
        <RouterProvider router={routes} />
      </Provider>
      <ToastContainer />
    </div>
  );
}

export default App;
