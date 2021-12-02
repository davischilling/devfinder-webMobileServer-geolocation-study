import { useEffect, useState } from "react";
import "./styles.css";

const DevForm = ({ handleSubmit }) => {
  const [location, setLocation] = useState({
    latitude: "",
    longitude: "",
  });

  const [github_username, setGithub_username] = useState("");
  const [techs, setTechs] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation({
          latitude,
          longitude,
        });
      },
      err => err,
      { timeout: 3000, enableHighAccuracy: true, maximumAge: 0 }
    );
  }, []);

  const onFormSubmit = async e => {
    e.preventDefault();
    const { latitude, longitude } = location;
    await handleSubmit({
      github_username,
      techs,
      latitude,
      longitude,
    });
    setGithub_username("");
    setTechs("");
  };

  return (
    <form onSubmit={onFormSubmit}>
      <div className="input-block">
        <label htmlFor="github_username">Usuário do Github</label>
        <input
          name="github_username"
          value={github_username}
          onChange={e => setGithub_username(e.target.value)}
          id="github_username"
          required
        />
      </div>

      <div className="input-block">
        <label htmlFor="techs">Tecnologias</label>
        <input
          name="techs"
          value={techs}
          onChange={e => setTechs(e.target.value)}
          id="techs"
          required
        />
      </div>

      <div className="input-group">
        <div className="input-block">
          <label htmlFor="latitude">Latitude</label>
          <input
            name="latitude"
            type="text"
            id="latitude"
            value={Number(location.latitude).toFixed(4).toString()}
            readOnly
            required
          />
        </div>
        <div className="input-block">
          <label htmlFor="longitude">Longitude</label>
          <input
            name="longitude"
            type="text"
            id="longitude"
            value={Number(location.longitude).toFixed(4).toString()}
            readOnly
            required
          />
        </div>
      </div>

      <button type="submit">Salvar</button>
    </form>
  );
};

export default DevForm;
