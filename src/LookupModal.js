import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList} from 'react-native';
import Modal from "react-native-modal";
import PropTypes from 'prop-types';
import Utils from "./Utils";


export default class LookupModal extends React.Component {

    static propTypes = {
        onSelect: PropTypes.func,
        data: PropTypes.array,
        apiRoute: PropTypes.string,
        displayKey: PropTypes.string,
        searchFunc: PropTypes.func,
        placeholder: PropTypes.string,
    };

    static defaultProps = {
        onSelect: () => {
        },
        data: [],
        apiRoute: "",
        displayKey: "title",
        searchFunc: null,
        placeholder: "Search..."
    };

    state = {
        isVisible: false,
        searchResults: []
    };

    constructor(props) {
        super(props);
        if (!Utils.isFunction(this.props.searchFunc)) {
            this.props.searchFunc = this.defaultSearchFunc;
        }
        if (Utils.isEmpty(this.state.searchResults)) {
            this.state.searchResults = this.props.data;
        }
    }

    toggleModal(visible) {
        if (visible == null) {
            this.setState({isVisible: !this.state.isVisible})
        } else {
            this.setState({isVisible: !!visible})
        }
        if (visible === false && this.state.searchResults.length !== this.props.data.length) {
            this.setState({searchResults: this.props.data});
        }
    };

    search(text) {
        if (Utils.isFunction(this.props.searchFunc)) {
            let results = this.props.searchFunc(text, this.state.data);
            this.setState({searchResults: results});
        }
    }

    onSelect(item) {
        this.toggleModal(false);
        this.props.onSelect(item);
    }

    defaultSearchFunc = (text, data) => data.filter(item => item[this.props.displayKey].includes(text));

    render() {
        return (
            <View>
                <TouchableOpacity style={styles.selectButton} onPress={() => this.toggleModal(true)}>
                    <Text style={styles.selectText}>Select...</Text>
                </TouchableOpacity>
                <Modal
                    isVisible={this.state.isVisible}
                    onBackdropPress={() => this.setState({isVisible: false})}
                    onModalHide={() => this.setState({search: ""})}
                    onBackButtonPress={() => this.toggleModal(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.header}>
                            <TextInput
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
                                onPress={() => this.toggleModal(false)}
                            >
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            style={{width: '100%'}}
                            data={this.state.searchResults}
                            maxToRenderPerBatch={5}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    style={styles.item}
                                    onPress={() => this.onSelect(item)}>
                                    <Text style={styles.itemText}>{item[this.props.displayKey]}</Text>
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
        padding: 0,
        paddingBottom: 5,
        flex: 1
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
