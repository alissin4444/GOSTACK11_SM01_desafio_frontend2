import React, { useState, useEffect } from "react";

import api from "../services/api";

export default function Body() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [techs, setTechs] = useState("");
  const [error, setError] = useState({
    status: false,
    message: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [repositories, setRepositories] = useState([]);

  async function handleFormSubmit(e) {
    e.preventDefault();
    if (title === "") {
      setError({
        message: "Title is required",
        status: true,
      });
    } else if (url === "") {
      setError({
        message: "Url is required",
        status: true,
      });
    } else if (techs === "") {
      setError({
        message: "Techs is required",
        status: true,
      });
    } else {
      setShowForm(false);
      setTitle("");
      setUrl("");
      setTechs("");

      const repository = {
        title,
        url,
        techs: techs.replace(/ /g, "").split(","),
      };

      const response = await api.post("repositories", repository);

      setRepositories([...repositories, response.data]);
    }
  }

  async function handleRemoveRepo(id) {
    api.delete(`repositories/${id}`);

    setRepositories([...repositories.filter((repo) => repo.id !== id)]);
  }

  useEffect(() => {
    api
      .get("repositories")
      .then((repository) => setRepositories(repository.data));
  }, []);

  return (
    <div id="body">
      <div>
        <h1>Repository List</h1>
        <button onClick={() => setShowForm(true)}>Add new</button>
      </div>
      {showForm && (
        <form onSubmit={(e) => handleFormSubmit(e)}>
          {error.status && <p>{error.message}</p>}
          <label htmlFor="title">TITLE</label>
          <input
            id="title"
            placeholder="Write your title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <label htmlFor="url">URL</label>
          <input
            id="url"
            placeholder="Write your url"
            onChange={(e) => setUrl(e.target.value)}
            value={url}
          />
          <label htmlFor="techs">TECHS</label>
          <input
            id="techs"
            placeholder="Write yours techs separated by comma"
            onChange={(e) => setTechs(e.target.value)}
            value={techs}
          />
          <button type="submit">SAVE</button>
        </form>
      )}
      <ul>
        {repositories.length > 0 ? (
          repositories.map((repo) => (
            <>
              <li key={repo.id}>
                <div>
                  <div>
                    <h1>{repo.title}</h1>
                    <ul>
                      {repo.techs.map((tech) => (
                        <li key={tech}>{tech}</li>
                      ))}
                    </ul>
                  </div>
                  <p>rocketseat.com.br</p>
                </div>
                <button onClick={() => handleRemoveRepo(repo.id)}>
                  REMOVE
                </button>
              </li>
            </>
          ))
        ) : (
          <h2 id="n_repo">Add a new reposotory to see the list</h2>
        )}
      </ul>
    </div>
  );
}
