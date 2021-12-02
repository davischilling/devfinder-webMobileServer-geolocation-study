import "./App.css";
import "./global.css";
import "./Sidebar.css";
import "./Main.css";
import { useEffect, useState } from "react";
import api from "./services/api";
import DevItem from "./components/DevItem";
import DevForm from "./components/DevForm";

function App() {
  const [devs, setDevs] = useState([]);

  async function loadDevs() {
    const response = await api.get("/devs/all");
    setDevs(response.data);
  }

  useEffect(() => {
    loadDevs();
  }, []);

  const handleSubmit = async data => {
    await api.post("/devs", data);
    loadDevs();
  };

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm handleSubmit={handleSubmit} />
      </aside>
      <main>
        <ul>
          {devs.length > 0 &&
            devs.map(dev => <DevItem key={dev._id} dev={dev} />)}
        </ul>
      </main>
    </div>
  );
}

export default App;
