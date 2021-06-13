import React, { useRef, useState, useEffect } from "react";

import "./MultipleImageUpload.scss";
import MultipleImageViewer from "./MultipleImageViewer";
import Button from "./../FormElements/Button";

const MultipleImageUpload = (props) => {
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const [isValid, setIsValid] = useState();
  const imageRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }

    props.onInput(props.id, file, isValid);
    const handleFileChosen = async (file) => {
      return new Promise((resolve, reject) => {
        let fileReader = new FileReader();
        fileReader.onload = () => {
          resolve(fileReader.result);
        };
        fileReader.onerror = reject;
        fileReader.readAsDataURL(file);
      });
    };

    const readAllFiles = async (AllFiles) => {
      const results = await Promise.all(
        AllFiles.map(async (file) => {
          const fileContents = await handleFileChosen(file);
          return fileContents;
        })
      );
      let a = results.map((e, index) => {
        let data = {
          id: index.toString(),
          content: e,
        };
        return data;
      });
      setPreview(a);
    };

    readAllFiles(file);
  }, [file]);

  const choseImageHandler = (event) => {
    let picked;
    let fileIsValid = isValid;

    if (event.target.files && event.target.files.length <= 10) {
      picked = Array.from(event.target.files);
      for (let i = 0; i < picked.length; i++) {
        if (picked[i].size < 1000000) {
          setIsValid(true);
          fileIsValid = true;
        } else {
          setIsValid(false);
          fileIsValid = false;
          break;
        }
      }
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    if (fileIsValid) {
      console.log(picked);
      setFile(picked);
    }
  };
  const imageHandler = (e) => {
    e.preventDefault();
    imageRef.current.click();
  };

  const removeFile = (id) => {
    let files = file.map((e) => e);
    files.splice(id, 1);
    setFile(files);

    props.removePhotoFromForm(id);
  };

  return (
    <div className="multiple-image-upload-wrapper">
      <input
        id={props.id}
        style={{ display: "none" }}
        ref={imageRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        onChange={choseImageHandler}
        multiple
      />

      <div className="image_input_wrapper">
        <Button onClick={imageHandler} className={"image_input_button"}>
          Dodaj zdjęcia
        </Button>
        {preview && (
          <MultipleImageViewer
            photos={preview}
            removeFile={removeFile}
            reorderPhotos={props.reorderPhotos}
          ></MultipleImageViewer>
        )}
        {!preview && (
          <div className="multiple-image-upload-container">
            <div className="title_wrapper">
              <p className="title">Dodaj zdjęcia obiektu</p>
              <p className="subtitle">
                Maksymalny rozmiar pojedynczego zdjęcia to 1MB. Maksymalnie
                możesz dodać 10 zdjęć. Musisz dodać przynajmniej jedno zdjęcie.
              </p>
            </div>
          </div>
        )}
      </div>
      {isValid === false && <p className="error">{props.errorText}</p>}
    </div>
  );
};

export default MultipleImageUpload;
