import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PhotoIcon } from '@heroicons/react/24/solid';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const Form = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [showResponse, setShowResponse] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleCancel = (event) => {
    setSelectedImage(null);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleDragStart = (event) => {
    setDragging(true);
    setOffset({ x: event.clientX, y: event.clientY });
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  const handleDrag = (event) => {
    if (dragging) {
      const dx = event.clientX - offset.x;
      const dy = event.clientY - offset.y;
      setOffset({ x: event.clientX, y: event.clientY });

      const image = document.getElementById('selected-image');
      image.style.transform = `translate(${dx}px, ${dy}px)`;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    if (selectedImage) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        const base64Image = reader.result;
        const formData = new FormData();
        formData.append('image', base64Image);
        console.log('formData:', formData); 
        console.log('base64image:', base64Image)
        console.log('tipo de SelectedImaged:', typeof selectedImage);
        axios
          .post('http://192.168.1.63:5070/predict', formData)
          .then((response) => {
            setResponseMessage(response.data.resultado);
            setShowResponse(true);
            console.log(response.data);
            setTimeout(() => {
              setShowResponse(false);
              setResponseMessage('');
            }, 5000);
          })
          .catch((error) => {
            console.error(error);
          });
      };
  
      reader.readAsDataURL(selectedImage);
    }
  };  

  return (
    <form className='mb-16'>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div  data-aos="zoom-in" className="sm:mx-auto sm:w-full sm:max-w-sm">
                <a href="/">
                <img
                    className="mx-auto h-10 w-auto mt-5"
                    src="/img/banana.svg"
                    alt="Your Company"
                />
                </a>
                <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Clasificación herpetológica
                </h2>
          </div>

          <p data-aos="zoom-in" className="mt-3 text-sm leading-6 text-gray-600">
            Identifica si es verdadera o falsa según apariencia.
          </p>
          {showResponse && (
            <>
            <div data-aos="flip-up" className="mt-3 text-sm text-white bg-green-500 py-2 px-4 rounded-md">
              {responseMessage}
            </div>
            {responseMessage === 'Coral verdadera' ? (
              <p data-aos="zoom-in" className="mt-3 -mb-4 text-sm leading-6 text-gray-600">
                Posible taxón: Micrurus nigrocinctus - Micrurus alleni - Micrurus mosquitensis 

              </p>
            ) : (
              <p data-aos="zoom-in" className="mt-3 -mb-4 text-sm leading-6 text-gray-600">
                Posible taxón: Lampropeltis elapsoides - Lampropeltis triangulum - Calliophis bivirgatus - Lampropeltis gentilis
              </p>
            )}
            </>
          )}
          
          
          <div data-aos="zoom-out" className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <div
                className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                onDrag={handleDrag}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                draggable
              >
                {selectedImage ? (
                  <div
                    className="h-52 w-52 max-w-full overflow-hidden"
                    style={{ cursor: dragging ? 'grabbing' : 'grab' }}
                  >
                    <img
                      id="selected-image"
                      src={URL.createObjectURL(selectedImage)}
                      alt="Selected Image"
                      className="object-cover h-full w-full transform hover:scale-105 transition-transform duration-200"
                      style={{
                        objectPosition: 'center',
                        height: '100%',
                        width: '100%',
                        userSelect: 'none',
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-amber-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-amber-500"
                      >
                        <span>Sube un archivo</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <p className="pl-1">o arrástralo y suéltalo</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, JPEG, BMP up to 10MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
            <button data-aos="fade-right" type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={handleCancel}>
            Cancelar
            </button>
            <button
            data-aos="fade-left"
            onClick={handleSubmit}
            type="submit"
            className="rounded-md bg-stone-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
            >
            Enviar
            </button>
      </div>
    </form>
  );
};
