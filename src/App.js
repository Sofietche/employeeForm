import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { countries, positions } from './data/data';
import './App.css';
import uploadIcon from './assets/upload-image.svg'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#417cea',
      color: 'white', 
      borderColor: 'none',
      borderRadius: '80px',
      padding: '4px',
      boxShadow: 'none',
      '&:hover': { borderColor: '#06296b' }
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '15px',
      backgroundColor: '#417cea',
      color: 'white'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#1a3c7d' : state.isFocused ? '#1c4c96;' : 'none',
      color: state.isSelected ? 'white' : state.isFocused ? 'white' : 'white',
      borderRadius: '20px',
      padding: '10px',
    }),
    placeholder: (provided) => ({ 
      ...provided,
      color: 'white'
    }),
    singleValue: (provided) => ({ 
      ...provided,
      color: 'white'
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#06296b',  
      borderRadius: '10px', 
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'white',  
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'white',  
      ':hover': {
        backgroundColor: '#1a3c7d',
        color: 'white',
      }
    }),
  };
  

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm();
  const [preview, setPreview] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [filteredPositions, setFilteredPositions] = useState(positions);
  const [isEditable, setIsEditable] = useState(true);


      const handleFileChange = e => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => setPreview(reader.result);
          reader.readAsDataURL(file);
        }
      };

      const handlePositionInputChange = (inputValue) => {
        const filteredPositions = positions.filter(position =>
          position.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredPositions(filteredPositions);
      };

      const handleCountryInputChange = (inputValue, actionMeta) => {
        if (actionMeta.action === 'input-change') {
          const inputLower = inputValue.toLowerCase();
      
          const filteredCountries = countries.filter(country => {
            const matchLabel = country.label.toLowerCase().includes(inputLower);
            const matchKeywords = country.keywords.some(keyword => keyword.toLowerCase().includes(inputLower));
            return matchLabel || matchKeywords;
          });
      
          setFilteredCountries(filteredCountries.length ? filteredCountries : []);
        }
      };
      

      const onSubmit = data => {
        if (Object.keys(errors).length === 0) {
          console.log(data);
          toast.success('Datos guardados con éxito', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setIsEditable(false);
        } else {
          toast.error('Por favor, completa todos los campos requeridos.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      };

        const handleEdit = () => {
          setIsEditable(true);
        };

  return (
    <div className="form-container">
      <div className="header-container">
      <h1>Alta de empleados</h1>
      <p>Por favor complete todos los campos necesarios para el alta del empleado</p>
      </div>
      <ToastContainer />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="photo-and-inputs">
          <label htmlFor="photo-upload" className="label-file" style={{ backgroundImage: `url(${preview || uploadIcon})` }}>
            {!preview && <span className="icon-placeholder"></span>}
          </label>
          <input id="photo-upload" type="file" {...register("photo", { required: false })} onChange={handleFileChange} disabled={!isEditable}/>
          <div className="input-group">
            <label className="input-label">
              Nombre
              <input type="text" {...register("firstName", { required: true })}disabled={!isEditable} className={`input-field ${errors.firstName ? 'input-error' : ''}` } />
            </label>
            {errors.firstName && <span className="error">Nombre es requerido</span>}

            <label className="input-label">
              Apellido
              <input type="text" {...register("lastName", { required: true })}disabled={!isEditable} className={`input-field ${errors.lastName ? 'input-error' : ''}`} />
            </label>
            {errors.lastName && <span className="error">Apellido es requerido</span>}
          </div>
        </div>
        <div className="select-container">
          <label className="input-label">
            Posición
            <Controller
              name="position"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  styles={customStyles}
                  options={filteredPositions}
                  onInputChange={handlePositionInputChange}
                  placeholder="Selecciona una posición"
                  disabled={!isEditable}
                />
              )}
            />
          </label>
          {errors.position && <span className="error">Posición es requerida</span>}

          <label className="input-label">
            Países visitados
            <Controller
              name="countriesVisited"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  styles={customStyles}
                  options={filteredCountries}
                  onInputChange={handleCountryInputChange}
                  placeholder="Selecciona países que visitó"
                  disabled={!isEditable}
                />
              )}
            />
          </label>
          {errors.countriesVisited && <span className="error">Selecciona al menos un país</span>}
        </div>
        <div className="buttons-container">
          <button type="button" className="edit-button" onClick={handleEdit}>Editar</button>
          <button type="submit" className="save-button">Guardar</button>
        </div>
      </form>
    </div>
  );
}