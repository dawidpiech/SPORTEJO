import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import "./ImageUpload.scss";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const [isValid, setIsValid] = useState();
  const imageRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreview(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const choseImageHandler = (event) => {
    let picked;
    let fileIsValid = isValid;

    if (event.target.files && event.target.files.length === 1) {
      picked = event.target.files[0];
      if (picked.size < 1000000) {
        setFile(picked);
        setIsValid(true);
        fileIsValid = true;

        console.log(file);
      } else {
        setIsValid(false);
        fileIsValid = false;
      }
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, picked, fileIsValid);
  };
  const imageHandler = () => {
    imageRef.current.click();
  };

  return (
    <div className="image_input">
      <input
        id={props.id}
        style={{ display: "none" }}
        ref={imageRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        onChange={choseImageHandler}
      />

      <div className="image_input_wrapper" onClick={imageHandler}>
        {preview && <img src={preview} alt="Preview" />}
        {!preview && (
          <div>
            <div className="icon">
              <FontAwesomeIcon icon={faPlus} />
            </div>
            <div className="title_wrapper">
              <p className="title">Dodaj zdjęcie profilowe</p>
              <p className="subtitle">Maksymalny rozmiar zdjęcia to 1MB</p>
            </div>
          </div>
        )}
      </div>
      {isValid === false && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
