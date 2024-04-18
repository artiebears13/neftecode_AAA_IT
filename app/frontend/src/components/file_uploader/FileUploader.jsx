import React, {useState, useRef} from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import {CsvTable} from "../csv_table/CsvTable";

const FileUploader = (props) => {
    const allowedFormats = ['csv'];
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [outputFile, setOutputFile] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadFileText, setUploadFileText] = useState(null);
    const fileInputRef = useRef(null);
    const docs_number = 1;

    const handleFileChange = (e) => {
        // console.log('supertest ', selectedFiles === e.target.files);
        setSelectedFiles([...selectedFiles, ...e.target.files]);
        // console.log('selected files: ', e.target.files[0]);
    };


    const checkFiles = (files) => {
        const maxFileSize = 5 * 1024 * 1024; // 20MB in bytes
        if (!(files && files.length)) {
            props.toast("Загрузите файлы", 'danger')
            return false;
        }

        if (files.length !== docs_number) {
            props.toast(`Выберите только один документ`, 'danger')
            return false;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size > maxFileSize) {
                props.toast(`File ${file.name} exceeds the maximum file size of 5MB`);
                return false; // Skip appending this file
            }
            const extension = files[i].name.split('.').pop().toLowerCase();
            if (!allowedFormats.includes(extension)) {
                props.toast("Неверный формат файла", "danger")
                return false;
            }
        }
        return true;
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = [...e.dataTransfer.files];
        setSelectedFiles([...selectedFiles, ...files]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        console.log('currentDocType:', props.currentDocType);

        if (!checkFiles(selectedFiles)) {
            return;
        }
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('files', selectedFiles[i]);
        }
        formData.append('doctype', props.currentDocType);

        const config = {
            method: 'POST',
            body: formData,
        };

        try {
            props.setResponse({});
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/upload`, config);
            console.log(response);
            if (response.ok) {

                const contentType = response.headers.get("content-type");

                // Handle file response
                console.log("get file");
                const fileBlob = await response.blob();
                setOutputFile(fileBlob);
                const text = await fileBlob.text();
                setUploadFileText(text);
                const file = new File([fileBlob], 'filename.csv', { type: 'text/csv' }); // You might need to adjust the filename and type
                // Do something with the file and begin metadata
                console.log("File:", file);
            } else {
                console.error('Error uploading files:', response.statusText, response.error, response.message, response.content);
            }
            props.toast("Файлы обработаны")
            props.setFiles(selectedFiles);
            setUploadedFile(selectedFiles[0])
            setSelectedFiles([]);
            fileInputRef.current.value = ''
        } catch (error) {
            console.error('Error uploading files:', error);
        } finally {
            setLoading(false);
        }
    };


    const checkFileFormat = (file) => {
        const extension = file.name.split('.').pop().toLowerCase();
        return allowedFormats.includes(extension);
    }

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const deleteFile = (index) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles.splice(index, 1);
        setSelectedFiles(updatedFiles);
    };

    const renderPopover = (title, content) => (
        <Popover>
            <Popover.Header>{title}</Popover.Header>
            <Popover.Body>{content}</Popover.Body>
        </Popover>
    );
    const handleDownload = () => {
        if (outputFile) {
            const url = window.URL.createObjectURL(outputFile);
            const link = document.createElement('a');
            link.href = url;
            if (uploadedFile) {
                link.setAttribute('download', `processed_${uploadedFile.name}`);
            } else {
                link.setAttribute('download', 'processed.csv');
            }
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        }
    }


    const popoverContent = `Допустимые форматы: csv`;

    return (
        <div className={"z-100 mt-20"}>
            <div
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="drag-drop-field z-100"
            >
                <i className="fa-regular fa-file-lines fa-big"></i>
                {/*<i className="fa-solid fa-file-export fa-big"></i>*/}
                {/*<i className="fa-solid fa-file-arrow-down fa-big"></i>*/}
                <h3 className="z-100">Перетащите файл сюда <br/>или <div
                    className="text-warning">выберите его вручную</div></h3>
                <div className="drag-drop-field__extensions">csv</div>
                <input
                    type="file"
                    multiple
                    onInput={handleFileChange}
                    // onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{display: 'none'}}
                />
            </div>


            <div className="input-control__buttons">
                <button className="btn btn-primary z-100" onClick={handleUpload}>Отправить</button>
                {/*<button className="btn btn-success modal-button" onClick={props.openModal}>Примеры запросов</button>*/}
                {/*{outputFile && (*/}
                {/*    <div>*/}
                {/*        <button className="btn btn-primary" onClick={handleDownload}>*/}
                {/*            Скачать*/}
                {/*        </button>*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>
            {loading && (
                <div className="big-center loader z-100"></div>
            )}
            <div className="uploaded-file__container z-100">
                <div className="uploaded-file__container">
                    {selectedFiles.length > 0 && (
                        selectedFiles.map((file, i) => (
                            <div className={`uploaded-file__item ${checkFileFormat(file) ? "" : "wrong"}`} key={i}>
                                {checkFileFormat(file) ? (
                                    <span
                                        className="uploaded-file__filename">{file.name.length > 15 ? `${file.name.substring(0, 5)}...${file.name.substring(file.name.length - 10)}` : file.name}</span>
                                ) : (
                                    <OverlayTrigger
                                        trigger={['hover', 'focus']}
                                        placement="top"
                                        overlay={renderPopover('Неверный формат', popoverContent)}
                                    >
                                        <span>{file.name}</span>
                                    </OverlayTrigger>
                                )}
                                <button className="btn btn-close-white uploaded-file__button"
                                        onClick={() => deleteFile(i)}>x
                                </button>
                            </div>
                        ))
                    )}
                </div>
                {uploadedFile && <CsvTable
                    fileText={uploadFileText}
                    filename={`processed_${uploadedFile.name}`}
                    handleDownload={handleDownload}
                />}
            </div>
        </div>
    );
};

export default FileUploader;