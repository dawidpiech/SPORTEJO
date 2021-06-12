import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

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
          setFile(picked);
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
    props.onInput(props.id, event.target.files, fileIsValid);
  };
  const imageHandler = () => {
    imageRef.current.click();
  };

  const removeFile = (id) => {
    let files = file.slice((e, index) => {
      if (index !== id) {
        return e;
      }
    });
    console.log(files);
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
        <Button onClick={imageHandler}>Add photos</Button>
        {preview && (
          <MultipleImageViewer
            photos={preview}
            removeFile={removeFile}
          ></MultipleImageViewer>
        )}
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

export default MultipleImageUpload;
