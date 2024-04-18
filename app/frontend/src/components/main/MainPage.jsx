import React from 'react';
import "./style.css";
import ExampleModal from "../modal/ExampleModal";
import TypeModal from "../modal/TypeModal";
import FileUploader from "../file_uploader/FileUploader";
import MyToast from "../toast/MyToast";

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isExampleModalOpen: false,
            isTypeModalOpen: false,
            responseData: {},
            showToast: false,
            ToastMessage: 'hello',
            toastVariant: 'success',
        };
    }




    setFiles = (files) => {
        this.setState({files: files});
    }

    onDocumentTypeChange = (key) => {
        this.setState({currentDocType: key});
        // console.log("choose: ", key);
    }


    openExampleModal = () => {
        // console.log("Modal open");
        this.setState({isExampleModalOpen: true});
    }

    closeExampleModal = () => {
        // console.log("Modal closed");
        this.setState({isExampleModalOpen: false});
    }
    openTypeModal = () => {
        this.setState({isTypeModalOpen: true});
    }


    onNewType = (typeName, categories) => {
        // console.log("onNewType", typeName, categories);
        fetch(`${process.env.REACT_APP_BACKEND}/update_template`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: typeName,
                categories: categories
            })
        })
            .then(response => {
                console.log(response);
                // if (!response.status === 200) {
                //     throw new Error('Network response was not ok');
                // }
                return response.json();
            })
            .then(data => {
                console.log(data)
                if (!(data.status_code===200) && !(typeof data.status_code === 'undefined')) {
                    console.log("here");
                    alert(data.error);
                }
                else {
                    if (data.error){
                        alert(data["error"]);
                    }
                    else {
                        console.log("init data: ", data);
                        console.log("init data: ", data);
                        this.setState({documentTypes: data}); // Set the fetched data to state
                    }
                }
                // Handle the fetched data as needed
            })
            .catch(error => {
                console.error('Error fetching data artmed:', error);
                alert('Error fetching data. Please try again later.');
            })
            .finally(() => {
                this.closeTypeModal(); // Close the modal regardless of success or failure
            });
    };


    closeTypeModal = () => {
        console.log("Modal closed");
        this.setState({isTypeModalOpen: false});
    }

    setResponse = (data) => {
        this.setState({responseData: data})
    }

    sendExample = async (name) => {
        console.log("Sending example");
        this.setState({isExampleModalOpen: false});
        console.log('name=', name);

        const requestData = {name: name};
        this.setState({loading: true});
        console.log(requestData);
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/handle_example`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Specify content type as JSON
                },
                body: JSON.stringify(requestData) // Convert JSON object to string
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            const data = await response.json();
            this.setState({responseData: data});
        } catch (error) {
            alert("Что-то пошло не так, попробуйте заново");
        } finally {
            this.setState({loading: false});
        }
    };


    handleDragOver = (event) => {
        event.preventDefault();
    };


    showToast = (message, toastVariant="success") => {

        console.log("toggle Toast");
        this.setState({ToastMessage: message});
        this.setState({toastVariant: toastVariant});
        this.setState({showToast: true});
        if (!this.state.showToast) {
            setTimeout(() => {this.setState({showToast: false})}, 3000)
        }
    };
    hideToast = () => {

        this.setState({showToast: false});

    };

    render() {
        const {loading, isExampleModalOpen, responseData} = this.state;
        return (
            <div className="main-page">
                <MyToast
                    message={this.state.ToastMessage}
                    show={this.state.showToast}
                    hideToggle={this.hideToast}
                    variant={this.state.toastVariant}
                />

                <div className="container mt-4 main-bg z-100">

                    <FileUploader
                        openModal={this.openExampleModal}
                        setFiles={this.setFiles}
                        setResponse={this.setResponse}
                        responseData={responseData}
                        toast={this.showToast}
                    />



                    {loading && (
                        <div className="big-center loader z-100"></div>
                    )}
                    <div>
                        <ExampleModal
                            isOpen={isExampleModalOpen}
                            onClose={this.closeExampleModal}
                            onAccept={this.sendExample}
                        >
                            <h2>Modal Content</h2>
                            <p>This is the content of the modal.</p>
                        </ExampleModal>
                        <TypeModal
                            isOpen={this.state.isTypeModalOpen}
                            onClose={this.closeTypeModal}
                            onAccept={this.onNewType}
                        ></TypeModal>
                    </div>
                </div>
            </div>
        );
    }
}

export default MainPage;