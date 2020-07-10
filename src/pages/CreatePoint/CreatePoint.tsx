import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";

import logo from "../../assets/logo.svg";
import "./styles.css";
import { ItemAPI } from "services/api/ItemAPI";
import { PointAPI } from "services/api/PointAPI";
import { IBGEAPI } from "services/api/IBGEAPI";
import { LeafletMouseEvent } from "leaflet";

interface IItems {
  id: number;
  title: string;
  image_url: string;
}

export const CreatePoint = () => {
  const history = useHistory();

  const [items, setItems] = useState<Array<IItems>>([]);
  const [ufs, setUfs] = useState<Array<string>>([]);
  const [cities, setCities] = useState<Array<string>>([]);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    whatsapp: string;
  }>({ name: "", email: "", whatsapp: "" });
  const [selectedItems, setSelectedItems] = useState<Array<number>>([]);
  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");
  const [latLng, setLatLng] = useState<{ lat: number; lng: number }>({
    lat: -23.5926074,
    lng: -46.6801928,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setLatLng({ lat: latitude, lng: longitude });
    });
  }, []);

  useEffect(() => {
    const retrieveItems = async () => {
      try {
        const response = await ItemAPI.list();
        setItems(response);
      } catch (e) {
        throw new Error(e);
      }
    };

    retrieveItems();
  }, []);

  useEffect(() => {
    const retrieveUfs = async () => {
      try {
        const response = await IBGEAPI.getUF();
        setUfs(response);
      } catch (e) {
        throw new Error(e);
      }
    };
    retrieveUfs();
  }, []);

  useEffect(() => {
    const retrieveCities = async () => {
      try {
        const response = await IBGEAPI.getCities(selectedUf);
        setCities(response);
      } catch (e) {
        throw new Error(e);
      }
    };

    if (selectedUf !== "0") retrieveCities();
  }, [selectedUf]);

  const handleSelectUf = (event: ChangeEvent<HTMLSelectElement>) =>
    setSelectedUf(event.target.value);

  const handleSelectCity = (event: ChangeEvent<HTMLSelectElement>) =>
    setSelectedCity(event.target.value);

  const handleMapClick = (event: LeafletMouseEvent) =>
    setLatLng({ ...event.latlng });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [event.target.name]: event.target.value });

  const handleSelectItems = (id: number) => {
    const alreadySelected = selectedItems.findIndex((item) => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      name: formData.name,
      email: formData.email,
      whatsapp: formData.whatsapp,
      uf: selectedUf,
      city: selectedCity,
      latitude: latLng.lat,
      longitude: latLng.lng,
      items: selectedItems,
    };

    try {
      await PointAPI.create(data);
      alert("Ponto de coleta criado");
      history.push("/");
    } catch (e) {
      throw new Error(e);
    }
  };

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Logo ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>
      <form onSubmit={handleOnSubmit}>
        <h1>
          Cadastro do <br /> ponto de coleta
        </h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="text"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map
            center={[latLng.lat, latLng.lng]}
            zoom={15}
            onClick={handleMapClick}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[latLng.lat, latLng.lng]} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                onChange={handleSelectUf}
                value={selectedUf}
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option value={uf}>{uf}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                onChange={handleSelectCity}
                value={selectedCity}
              >
                <option value="0">Selecione uma cidade</option>
                {cities.map((city) => (
                  <option value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais items abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelectItems(item.id)}
                className={selectedItems.includes(item.id) ? "selected" : ""}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>
        <button type="submit">Cadastar ponto de coleta</button>
      </form>
    </div>
  );
};
