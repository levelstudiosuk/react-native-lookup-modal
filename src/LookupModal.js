import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList} from 'react-native';
import Modal from "react-native-modal";
import PropTypes from 'prop-types';
import Utils from "./Utils";


export default class LookupModal extends React.Component {

    static propTypes = {
        onSelect: PropTypes.func,
        onCancel: PropTypes.func,
        data: PropTypes.array,
        apiRoute: PropTypes.string,
        displayKey: PropTypes.string,
        searchFunc: PropTypes.func,
        placeholder: PropTypes.string,
        selectText: PropTypes.string,
        selectButtonStyle: PropTypes.object,
        selectButtonTextStyle: PropTypes.object,
        hideSelectButton: PropTypes.bool,
        customSelectButton: PropTypes.element,
        contentStyle: PropTypes.object,
        itemStyle: PropTypes.object,
        itemTextStyle: PropTypes.object,
    };

    static defaultProps = {
        onSelect: () => {
        },
        onCancel: () => {
        },
        data: [],
        apiRoute: "",
        displayKey: "title",
        searchFunc: null,
        placeholder: "Search...",
        selectText: "Select...",
        selectButtonStyle: {},
        selectButtonTextStyle: {},
        hideSelectButton: false,
        customSelectButton: null,
        contentStyle: {},
        itemStyle: {},
        itemTextStyle: {},
    };

    state = {
        isVisible: false,
        searchResults: []
    };

    toggleModal(visible) {
        if (visible == null) {
            this.setState({isVisible: !this.state.isVisible})
        } else {
            this.setState({isVisible: !!visible})
        }
    };

    resetResults() {
        if (this.state.searchResults.length !== this.props.data.length) {
            this.setState({searchResults: this.props.data});
        }
    }

    search(text) {
        if (Utils.isFunction(this.props.searchFunc)) {
            let results = this.props.searchFunc(text, this.props.data);
            this.setState({searchResults: results});
        } else {
            let results = this.defaultSearchFunc(text, this.props.data);
            this.setState({searchResults: results});
        }
    }

    onSelect(item) {
        this.toggleModal(false);
        this.props.onSelect(item);
    }

    onCancel() {
        this.toggleModal(false);
        this.props.onCancel();
    }

    defaultSearchFunc = (text, data) => data.filter(item => item[this.props.displayKey].toLowerCase().indexOf(text.toLowerCase()) > -1);

    render() {
        let selectButton;
        if (!this.props.hideSelectButton && !this.props.customSelectButton) {
            selectButton = (
                <TouchableOpacity
                    style={{...styles.selectButton, ...this.props.selectButtonStyle}}
                    onPress={() => this.toggleModal(true)}
                >
                    <Text style={{...styles.selectText, ...this.props.selectButtonTextStyle}}>
                        {this.props.selectText}
                    </Text>
                </TouchableOpacity>
            );
        } else if (!this.props.hideSelectButton && this.props.customSelectButton) {
            selectButton = (
                <TouchableOpacity onPress={() => this.toggleModal(true)}>
                    {this.props.customSelectButton}
                </TouchableOpacity>
            );
        }

        return (
            <View>
                {selectButton}
                <Modal
                    isVisible={this.state.isVisible}
                    onBackdropPress={() => this.onCancel()}
                    onModalHide={() => this.setState({search: ""})}
                    onBackButtonPress={() => this.onCancel()}
                    onModalShow={() => this.resetResults()}
                >
                    <View style={{...styles.modalContent, ...this.props.contentStyle}}>
                        <View style={styles.header}>
                            <TextInput
onSubmitEditing={() => this.state.searchResults.length === 0 ?  this.onSelect({ name: this.state.search }) : null}
                                style={styles.textInput}
                                placeholder={this.props.placeholder}
                                onChangeText={(text) => {
                                    this.setState({search: text});
                                    this.search(text);
                                }}
                                value={this.state.search}
                            />
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => this.onCancel()}
                            >
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            keyboardShouldPersistTaps={'always'}
                            style={{width: '100%'}}
                            data={this.state.searchResults}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    style={{...styles.item, ...this.props.itemStyle}}
                                    onPress={() => this.onSelect(item)}>
                                    <Text style={{...styles.itemText, ...this.props.itemTextStyle}}>
                                        {item[this.props.displayKey] ? item[this.props.displayKey] : ""}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: "white",
        padding: 10
    },
    closeButton: {
        width: 40,
        padding: 5,
        justifyContent: 'center',
    },
    closeButtonText: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row'
    },
    textInput: {
        width: "100%",
        paddingLeft: 10,
        paddingBottom: 5,
        flex: 1,
        borderBottomWidth: 1,
        borderColor: "#c7c7c7"
    },
    selectText: {
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
    selectButton: {
        margin: 5,
        padding: 5,
        backgroundColor: '#d6d6d6'
    },
    item: {
        padding: 10
    },
    itemText: {
        fontSize: 18
    }
});
