import "./styles.css";

const DevItem = ({ dev }) => {
  return (
    <li className="dev-item">
      <header>
        <img src={dev.avatar_url} alt={dev.name} />
        <div className="user-info">
          <strong>{dev.name}</strong>
          <span>{dev.techs && dev.techs.join(", ")}</span>
        </div>
      </header>
      <p>{dev.bio}</p>
      <a href={dev.html_url}>Acessar perfil no github</a>
    </li>
  );
};

export default DevItem;
