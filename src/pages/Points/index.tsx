import React, { useEffect, useState, ChangeEvent} from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';    
import axios from 'axios';
import api from '../../services/api';

import './style.css';

import logo from '../../assets/logo.svg';

//informar o tipo da variavel

interface Item {
    id: number;
    title: string;
    image_url: string;
}
interface Point {
    id: number;
    name: string;
    image: string;
    image_url: string;
    latitude: number;
    longitude: number;
    whatsapp: number;
    email: string;
    items: number;
  }

interface IBGEUFResponse {
    sigla: string;
}

interface IBGEUCityResponse {
    nome: string;
}


const Points = () =>{
   const [items, setItems] = useState<Item[]>([]);
   const [ufs, setUfs] = useState<string[]>([]);
   const [cities, setCities] = useState<string[]>([]);
   const [points, setPoints] = useState<Point[]>([]);

//    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);

   const [selectedUf, setSelectedUf] = useState('0');
   const [selectedCity, setSelectedCity] = useState('0');
   const [selectedItems, setSelectedItems] = useState<number[]>([]);
   const [selectedPointId, setSelectedPointId] = useState<number>(0);
   const [showPoints, setShowPoints] = useState<Point[]>([]);

//    useEffect(() => {
//     navigator.geolocation.getCurrentPosition(position =>{
//         const { latitude, longitude } = position.coords;

//         setInitialPosition([latitude, longitude]);
//     })
//    }, [])

    useEffect(() => {
        api.get('items').then( response => {
           setItems(response.data);
        });
    }, []);

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(response => {
            const UfInitials = response.data.map(uf => uf.sigla);

            setUfs(UfInitials);
        });
    }, []);

    useEffect(() => {
        if(selectedUf === '0'){
            return;
        }
            axios
            .get<IBGEUCityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome);

                setCities(cityNames);
            })
    }, [selectedUf])
    

    useEffect(() => {
        api.get('points', {
          params: {
            city: selectedCity,
            uf: selectedUf,
            items: selectedItems
          }
        }).then(response => {
            if(selectedItems === []){
                setPoints([]);
            }
            setPoints([]);
            setPoints(response.data);
        })
      }, [selectedItems]);
    
      useEffect(() => {
        const filteredPoints = points.filter(point =>
            (point.id === selectedPointId))
        setShowPoints( filteredPoints);
      },[selectedPointId]);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;
        setSelectedUf(uf); 
    }
    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;
        setSelectedCity(city);
    }
    function handleSelectItem(id: number){
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if(alreadySelected >= 0){
            const filteredItems = selectedItems.filter(item => item !== id);

            setSelectedItems(filteredItems);
        }else{
            setSelectedItems([...selectedItems, id ]);
        }
    }

    function handlePointClick(id: number){
        setSelectedPointId(id);
    }

    return(
        <div id="page-create-point">
            <header>
                <img src={logo} alt="logoSVG" />

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form>
             <h1>{selectedCity ==='0' || selectedUf === '0' ?  "Selecione uma cidade para buscar pontos de coleta"  : `Pontos de coleta em: ${selectedCity},${selectedUf}`}</h1>
                <fieldset>
                    {
                     points.length > 0 && 
                    <>   
                    <label>Clique no ponto para mais detalhes</label> 
                    <Map 
                    center={[points[0].latitude, points[0].longitude]} 
                    zoom={10} 
                    >
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {
                        points.map(point =>(
                        <Marker 
                            key={point.id} 
                            position={[point.latitude, point.longitude]}
                            riseOnHover={true} 
                            title={point.name} 
                            onCLick={() => handlePointClick(point.id)}/>)) 
                        }
                    </Map>
                    </>
                    }
                    {
                     selectedPointId !== 0 &&
                      
                    showPoints.map(sPoint => (
                        <div  key={sPoint.id} className="detailContainer">
                            <img src={sPoint.image_url} alt="Point" />
                            <div className="list">
                                <ul>
                                    <li><h3>{sPoint.name}</h3></li>
                                    <li><h4>Telefone(Whatsapp): </h4>{sPoint.whatsapp}</li>
                                    <li><h4> Email:</h4> {sPoint.email}</li>
                                    <li><h4> Items coletados:</h4> {}</li>
                                </ul>
                            </div>
                        </div>     
                    ))  
                    }
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado(UF)</label>
                            <select 
                            name="uf" 
                            id="uf" 
                            value={selectedUf}
                            onChange={handleSelectUf}
                            >
                                <option value="0">Selecione um Estado</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                            name="city" 
                            id="city"
                            value={selectedCity}
                            onChange={handleSelectCity}
                            >
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítems de coleta</h2>
                        <span>Selecione um ou mais items abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li 
                            key={item.id} 
                            onClick={() => 
                            handleSelectItem(item.id)}
                            className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>
            </form>
        </div>
    );
}

export default Points; 

