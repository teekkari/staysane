import React from 'react';

import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';


class EditModule extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false
        };

    }

    toggleCollapse = () => {
        this.setState({
            open: !this.state.open
        });
    }

    render() {
        return(
            <div class="settings-edit-module-wrapper">

                <div className="settings-module" onClick={this.toggleCollapse} >
                    <div className="settings-module-title">{this.props.module.props.title}</div>
                    <div className="settings-module-actions">
                    <svg class="bi bi-chevron-down" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 01.708 0L8 10.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z" clip-rule="evenodd"/>
                    </svg>
                    </div>
                </div>

                <Collapse in={this.state.open}>
                    <div class="settings-module-fields">
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>Title</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl aria-label="Title" value={this.props.module.props.title} />
                        </InputGroup>

                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>Text</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl as="textarea" aria-label="Text" value={this.props.module.props.body} />
                        </InputGroup>
                        <Button className="mb-3" block size="sm" variant="outline-danger">Delete</Button>
                    </div>
                </Collapse>
            </div>
        );
    }

}

export default EditModule;